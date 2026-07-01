> 📦 [Kedhareswer/resume-render](https://github.com/Kedhareswer/resume-render) · ⭐ 0 · Python · updated 2026-02-23  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# Programmatic Resume Renderer

This project recreates the resume design from the provided image as a generated PDF.

## Files

- `render_resume.py`: Python renderer (ReportLab).
- `resume_data.json`: Resume content and profile data.
- `output/resume.pdf`: Generated result.
- `requirements.txt`: Python dependencies.

## Run

```bash
python -m pip install -r requirements.txt
python generate_demo_assets.py
python render_resume.py --data resume_data.json --output output/resume.pdf
python verify_resume.py --pdf output/resume.pdf
```

## Customize

Edit `resume_data.json` to change:
- Header/profile details
- Summary, experience, education
- Key achievements, skills, projects
- Footer text
