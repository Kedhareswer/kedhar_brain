> 📦 [Kedhareswer/Speech-Emotion-Recognition](https://github.com/Kedhareswer/Speech-Emotion-Recognition) · ⭐ 0 · — · updated 2024-12-22  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# Speech-Emotion-Recognition

## Abstract
The Speech Emotion Recognition (SER) project aims to identify human emotions through the pitch, tone, rhythm, and intensity of their speech. Emotions play a crucial role in communication, and the SER project seeks to interpret these emotions effectively.

##### Link: [Google Drive Folder](https://drive.google.com/drive/folders/1DCpOiD2FoD4ZDhXN4aE8d5d6y0W6nz_k)

## Objective
The overall objective is to develop an efficient and reliable SER model using CNNs. The project focuses on accurate classification of emotions from audio samples and explores potential applications.

## Key Objectives:
- Developing a Robust SER Model: Present an emotion recognition and classification method based on the CNN model.
- Analyzing and Preprocessing Different Datasets: Combine and preprocess multiple publicly available datasets.
- Apply Data Augmentation: Enhance model robustness with noise injection, pitch shifting, and speed alteration.
- Feature Extraction and Audio Feature Engineering: Extract important audio features like ZCR, RMS, and MFCCs.
- Enhance Model Generalization: Ensure the model generalizes well to new, unseen data.
- Model Performance Testing: Measure accuracy, precision, recall, and F1-score to assess performance.
- Practical Applications of SER: Research applications in various domains where emotional awareness is impactful.
- Future Research in SER: Provide a foundation for future SER research with larger datasets and advanced models.

## Approach
### Data Preparation
- Dataset: Utilized RAVDESS, TESS, SAVEE, and CREMA-D datasets.
- Preprocessing: Resized, normalized, and applied transformations to enhance model robustness.

## Model Architecture
Developed a deep neural network tailored for emotion recognition.

## Training
Experimented with various neural network layers and configurations. Fine-tuned hyperparameters to balance model complexity with training time.

## Evaluation
Used metrics such as accuracy, precision, recall, and F1-score to evaluate model performance. Conducted qualitative assessments to ensure accurate representation of key emotions.

## Results
Successfully classified emotions from audio samples with high accuracy. Demonstrated potential for applications in various domains.

## Key Insights
- The model successfully learned to classify emotions based on speech features.
- Fine-tuning layers and experimenting with hyperparameters were crucial to achieving high performance.

## Future Work
- Experiment with larger datasets for broader generalization.
- Extend the model to support real-time emotion detection.

## Getting Started
To get started with the SER project, follow these steps:

### Prerequisites
- Python 3.x
- TensorFlow
- NumPy
- librosa
- Scikit-learn

### Usage
1. Data Preprocessing: Prepare the datasets and extract audio features.
2. Model Training: Train the CNN model with the preprocessed data.
3. Model Evaluation: Evaluate the model's performance using test datasets.
4. Prediction: Use the trained model to predict emotions from new audio samples.

## Contributing
Contributions are welcome! Please feel free to submit issues and pull requests to enhance the project.
