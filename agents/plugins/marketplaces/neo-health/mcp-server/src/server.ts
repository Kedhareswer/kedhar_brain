/**
 * neo-health MCP server entry point. Picks transport per env (MCP_TRANSPORT).
 *
 *   http  -> Streamable HTTP server with bearer-token auth (production /
 *            boss's Claude.ai Custom Connector)
 *   stdio -> JSON-RPC over stdio (devs via .mcp.json)
 *
 * Both transports serve the same registered tools.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { config } from "./config.js";
import {
  refreshSnapshot,
  startScheduledRefresh,
  getSnapshot,
} from "./vault-snapshot.js";

// Tool handlers
import { vaultSearch, vaultSearchTool } from "./tools/vault-search.js";
import { vaultRead, vaultReadTool } from "./tools/vault-read.js";
import { moduleSummary, moduleSummaryTool } from "./tools/module-summary.js";
import { findRelatedPrds, findRelatedPrdsTool } from "./tools/find-related-prds.js";
import {
  listFhirResourcesUsed,
  listFhirResourcesUsedTool,
} from "./tools/list-fhir-resources-used.js";

// ---------- Tool registry ----------

const tools = [
  vaultSearchTool,
  vaultReadTool,
  moduleSummaryTool,
  findRelatedPrdsTool,
  listFhirResourcesUsedTool,
] as const;

type ToolName = (typeof tools)[number]["name"];

const handlers: Record<ToolName, (args: any) => unknown> = {
  vault_search: (a) => vaultSearch(a),
  vault_read: (a) => vaultRead(a),
  module_summary: (a) => moduleSummary(a),
  find_related_prds: (a) => findRelatedPrds(a),
  list_fhir_resources_used: () => listFhirResourcesUsed(),
};

// ---------- MCP server setup ----------

function createMcpServer(): Server {
  const server = new Server(
    {
      name: "neo-health-vault",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: tools.map((t) => ({ ...t })) };
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const name = req.params.name as ToolName;
    const handler = handlers[name];
    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }
    try {
      const result = handler(req.params.arguments ?? {});
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (e) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Tool ${name} error: ${(e as Error).message}`,
          },
        ],
      };
    }
  });

  return server;
}

// ---------- HTTP transport ----------

async function startHttp(): Promise<void> {
  // Map sessionId -> transport so multiple boss sessions stay isolated.
  const transports = new Map<string, StreamableHTTPServerTransport>();

  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // Health check (unauthenticated; reports vault freshness)
    if (req.url === "/healthz" && req.method === "GET") {
      const snap = getSnapshot();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          loadedAt: snap.loadedAt.toISOString(),
          lastPullAt: snap.lastPullAt?.toISOString() ?? null,
          lastPullError: snap.lastPullError,
          pages: snap.pages.length,
        })
      );
      return;
    }

    if (req.url === "/mcp") {
      // Bearer-token auth
      const authHeader = req.headers["authorization"];
      const token =
        typeof authHeader === "string" && authHeader.startsWith("Bearer ")
          ? authHeader.slice("Bearer ".length).trim()
          : null;
      if (!token || !config.tokens.has(token)) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "unauthorized" }));
        return;
      }
      const tokenLabel = config.tokens.get(token);

      // Per-session transport keyed by Mcp-Session-Id header.
      const sessionHeader = req.headers["mcp-session-id"];
      const sessionId =
        typeof sessionHeader === "string" && sessionHeader.length > 0
          ? sessionHeader
          : randomUUID();

      let transport = transports.get(sessionId);
      if (!transport) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => sessionId,
          enableJsonResponse: true,
        });
        transports.set(sessionId, transport);
        const server = createMcpServer();
        await server.connect(transport);
        // Cleanup on transport close
        transport.onclose = () => {
          transports.delete(sessionId);
        };
        console.log(
          `[mcp-http] new session ${sessionId.slice(0, 8)}… for token "${tokenLabel}"`
        );
      }

      try {
        await transport.handleRequest(req, res);
      } catch (e) {
        console.error(`[mcp-http] session ${sessionId.slice(0, 8)}…: ${(e as Error).message}`);
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "internal error" }));
        }
      }
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  });

  await new Promise<void>((resolve) => {
    httpServer.listen(config.port, () => {
      console.log(
        `[mcp-http] listening on :${config.port} | tokens=${config.tokens.size} | vault=${config.vaultPath}`
      );
      resolve();
    });
  });
}

// ---------- Stdio transport ----------

async function startStdio(): Promise<void> {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[mcp-stdio] connected | vault=${config.vaultPath}`);
}

// ---------- Bootstrap ----------

async function main(): Promise<void> {
  console.log(
    `[mcp-server] starting | transport=${config.transport} | vault=${config.vaultPath} | pull-interval=${config.vaultPullIntervalMs}ms`
  );
  await refreshSnapshot();
  startScheduledRefresh();

  if (config.transport === "http") {
    await startHttp();
  } else {
    await startStdio();
  }
}

main().catch((e) => {
  console.error(`[mcp-server] fatal: ${(e as Error).message}`);
  process.exit(1);
});
