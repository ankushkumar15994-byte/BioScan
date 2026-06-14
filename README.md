# Bioscan - Neural Plant Disease Scanner 🌱

Bioscan is a full-stack, AI-powered web application designed to help farmers and agriculturists quickly diagnose plant diseases from leaf images. The platform combines a custom-trained local MobileNetV2 neural network with advanced cloud-based analysis using the Google Gemini Pro Vision API.

## Features ✨

- **Instant Diagnostics**: Upload an image of a plant leaf or capture one with your camera.
- **Dual AI Analysis**:
  - **Local Model**: Fast inference using a custom-trained MobileNetV2 architecture.
  - **Deep Scan**: In-depth analysis, comprehensive diagnosis, and actionable treatment recommendations powered by Gemini AI.
- **Community Dashboard**: View real-time platform statistics, recent scans from users around the world, and a leaderboard of top contributors.
- **Pathogen Gallery**: A comprehensive knowledge base detailing common plant diseases, symptoms, and treatments.
- **Secure Authentication**: Email/Password and Google OAuth integration, backed by MongoDB.

## Tech Stack 🛠

**Frontend**
- React 18 + Vite
- React Router (Routing)
- Vanilla CSS (Glassmorphism & modern design system)
- React Google Login

**Backend**
- Python FastAPI
- Uvicorn (ASGI Server)
- PyMongo (MongoDB Atlas)
- Passlib & Bcrypt (Password Hashing)
- PyJWT (Authentication)
- Google Generative AI SDK (Gemini Vision)
- TensorFlow / Keras (Local ML engine)

## Getting Started 🚀

### Prerequisites
- Node.js (v16+)
- Python 3.10+
- MongoDB Atlas cluster
- Google Gemini API Key
- Google OAuth Client ID

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd bioscan
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd bioscan-backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   Create a `.env` file in the `bioscan-backend` directory with your secrets:
   ```env
   # .env
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn api.main:app --reload
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd bioscan-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up frontend environment variables:
   Create a `.env` file in the `bioscan-app` directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Machine Learning Model 🧠

To train or retrain the local diagnostic model:
1. Ensure your dataset is formatted in directories per class inside `bioscan-backend/ml/dataset/`.
2. Run the training script:
   ```bash
   cd bioscan-backend/ml
   python train_model.py
   ```
The model uses transfer learning on MobileNetV2 and exports an optimized `.h5` / `.keras` model for inference.

## Contributing 🤝

Contributions, issues, and feature requests are welcome. Feel free to check the issues page if you want to contribute.

## License 📝

This project is licensed under the MIT License.
