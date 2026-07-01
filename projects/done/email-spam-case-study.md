# Email Spam Case Study

**Status:** Done - Deployed · **Score:** 2/5

**Idea:** 2024-03-24   **Started:** 2024-03-24   **Completed:** 2024-05-30

## Description
This project implements a machine learning solution for email spam detection, providing a user-friendly web interface to classify emails as spam or legitimate. The system is designed to help users efficiently filter unwanted emails while ensuring important messages are not incorrectly flagged.

## Skills & Tech
`Python` · `HTML` · `CSS` · `Other` · `DL` · `ML`

## Approach
Data-driven development with a focus on model accuracy and user experience. The project follows a standard ML pipeline: data collection → preprocessing → feature engineering → model training → deployment. The solution is built with scalability in mind, allowing for easy updates to the classification model and expansion of features.

## Methodology
The project follows a structured data science workflow using the CRISP-DM (Cross-Industry Standard Process for Data Mining) methodology. It includes iterative cycles of data understanding, preparation, modeling, and evaluation. The development process incorporates version control, model versioning, and A/B testing to ensure reliability and performance. The solution is containerized for consistent deployment, and performance is continuously monitored post-deployment.

## Challenges
Data Quality: Managing noisy, imbalanced email datasets with varying formats and languages.
Feature Extraction: Effectively capturing meaningful patterns from email text and metadata.
Model Performance: Balancing precision and recall to minimize both false positives and false negatives.
Real-time Processing: Ensuring quick classification responses for a smooth user experience.
Security: Safeguarding sensitive email content during processing and storage.
Adaptability: Keeping the model current with evolving spam techniques and language patterns.
Scalability: Handling high volumes of classification requests efficiently.

## Outcomes
High Accuracy: Achieved 98% accuracy in spam detection with minimal false positives.
User-Friendly Interface: Developed an intuitive web interface for easy email classification.
Scalable Solution: Built a system that handles thousands of requests per second.
Documentation: Created comprehensive documentation for both users and developers.
Open Source: Contributed to the community with a well-documented, MIT-licensed project.
Performance: Reduced processing time to under 500ms per email classification.
Modular Design: Implemented a flexible architecture for easy updates and maintenance.
Knowledge Sharing: Documented key learnings and best practices for future projects.

## Links
- **GitHub:** <https://github.com/Kedhareswer/Mail_Classification_Case_Study>
- **Live:** <https://mail-classification-case-study.vercel.app>

## 🔬 Research & Enrichment

### Overview
"Email Spam Case Study" (a.k.a. *Spam Slayer: The ML Journey into Email Classification*) is an interactive, educational walkthrough of building an email spam-vs-ham classifier. Despite the portfolio listing Python/DL/ML, the deployed artifact at [mail-classification-case-study.vercel.app](https://mail-classification-case-study.vercel.app) is a Next.js/React/Tailwind site (97.8% TypeScript) hosting an 8-chapter narrative rather than a live inference API. The chapters teach a classic scikit-learn pipeline: text preprocessing, TF-IDF vectorization, and Multinomial Naive Bayes (with Logistic Regression, SVM, and Random Forest as comparison models).

### Why it matters
Spam and phishing remain a primary attack vector and productivity drain; effective filtering must minimize false positives (lost legitimate mail) while catching adversarially evolving spam. A teaching-oriented case study lowers the barrier for newcomers by explaining *why* each pipeline stage exists, not just the code, which is valuable given how often spam classifiers are a first ML project.

### How it works / Recommended approach
Grounded in the README and Chapter 4, the documented pipeline is: collect labeled emails → clean text + remove stop words → vectorize with scikit-learn `TfidfVectorizer(max_features=5000, ngram_range=(1,2))` → train `MultinomialNB` → evaluate via accuracy, precision/recall, classification report, and confusion matrix. Logistic Regression is positioned as interpretable, while SVM/Random Forest are noted as higher-accuracy but heavier. To extend it: ship the trained model behind a real API route (Next.js + a Python/FastAPI microservice or ONNX) so the site becomes a working demo, add calibrated probabilities, and persist the dataset/model versions.

### State of the art & comparable work
Classical TF-IDF + Naive Bayes/SVM is fast and strong (linear SVM often leads on micro-F1). Modern SOTA fine-tunes transformers — BERT/DistilBERT/RoBERTa — which capture semantics that bag-of-words misses ([MDPI comparative study](https://www.mdpi.com/2079-9292/13/24/4877)). A broad supervised survey is in [Taylor & Francis (2025)](https://www.tandfonline.com/doi/full/10.1080/21642583.2025.2474450). Notably, supervised models still beat zero-shot ChatGPT on spam by >10% macro-F1 ([arXiv 2402.15537](https://arxiv.org/html/2402.15537v1)). Comparable open projects: Apache [SpamAssassin](https://spamassassin.apache.org/old/publiccorpus/readme.html) and [aniass/Spam-detection](https://github.com/aniass/Spam-detection) (BERT + classic ML).

### Tech stack
Next.js, React, TypeScript, Tailwind CSS, Vercel (hosting); pedagogical ML code: Python, scikit-learn (`TfidfVectorizer`, `MultinomialNB`), pandas, numpy.

### Key challenges & risks
- Live site documents the model but exposes no working classifier endpoint — a gap vs. the "deployed/98% accuracy" portfolio claim.
- Reported metrics (98% accuracy, <500ms, thousands of req/s) are not substantiated in the README/repo.
- Class imbalance and concept drift; spam evolves, so static models decay.
- TF-IDF misses semantics, paraphrase, and image/HTML-based spam.

### Suggested next steps
- Wire a real inference endpoint (FastAPI/ONNX behind a Next.js route) so the demo actually classifies pasted email text.
- Train/validate on a named public corpus: [UCI Spambase](https://archive.ics.uci.edu/dataset/94/spambase), [Enron-Spam](https://github.com/MWiechmann/enron_spam_data), or [SMS Spam Collection](https://www.kaggle.com/datasets/uciml/sms-spam-collection-dataset).
- Add a fine-tuned DistilBERT baseline and report F1/AUC against the NB model.
- Publish a reproducible notebook with the real dataset, metrics, and confusion matrix to back the accuracy claims.
- Add SMOTE/class weighting and threshold tuning to control false positives.

### References
- [Email spam classification: supervised methods survey (Taylor & Francis, 2025)](https://www.tandfonline.com/doi/full/10.1080/21642583.2025.2474450)
- [Traditional ML vs Transformer models for phishing detection (MDPI Electronics, 2024)](https://www.mdpi.com/2079-9292/13/24/4877)
- [Evaluating ChatGPT for Spam Email Detection (arXiv 2402.15537)](https://arxiv.org/html/2402.15537v1)
- [UCI Spambase dataset](https://archive.ics.uci.edu/dataset/94/spambase)
- [SpamAssassin public mail corpus](https://spamassassin.apache.org/old/publiccorpus/readme.html)
- [Project repo: Kedhareswer/Mail_Classification_Case_Study](https://github.com/Kedhareswer/Mail_Classification_Case_Study)
- [Live case study site](https://mail-classification-case-study.vercel.app)

_Researched via web search · 8 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
