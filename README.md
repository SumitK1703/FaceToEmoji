# 🎭 Real-time Biometric Emotion & AR Scanner

A client-side AI application that performs real-time face detection, emotion analysis, age/gender estimation, and Augmented Reality (AR) overlays directly in the browser.

Built with **React**, **Vite**, and **TensorFlow.js** (via face-api.js).

## 🚀 Features

* **Real-time Emotion Recognition:** Detects 7 distinct emotions (Happy, Sad, Angry, Neutral, etc.) with high confidence.
* **Biometric Analysis:** Estimates Age and Gender on the fly.
* **AR Overlay:** Dynamic emoji and data badges that track and follow the user's face movements in real-time.
* **Smart Stability Logic:**
    * *Quote Generator:* Context-aware inspirational quotes that change only when your mood changes.
    * *Jitter Reduction:* Age/Gender predictions are throttled to prevent flickering.
* **Privacy First:** All AI processing happens **locally in the browser**. No video data is ever sent to a server.

## 🛠️ Tech Stack

* **Frontend Library:** React.js (Vite)
* **AI Engine:** face-api.js (TensorFlow.js wrapper)
* **Styling:** CSS3 (Flexbox/Grid)
* **State Management:** React Hooks (`useState`, `useRef`, `useEffect`)

## ⚙️ Installation & Run

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/SumitK1703/FaceToEmoji.git](https://github.com/SumitK1703/FaceToEmoji.git)
    cd FaceToEmoji
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Download AI Models**
    * Ensure the `public/models` folder contains the weights for `tiny_face_detector`, `face_expression_model`, and `age_gender_model`.
    * *Note: These are included in this repo under /public/models.*

4.  **Start the app**
    ```bash
    npm run dev
    ```

## 🧠 How it Works

1.  **Initialization:** The app loads 3 neural networks asynchronously into the browser memory.
2.  **Detection Loop:** A `setInterval` loop runs every 100ms, grabbing a frame from the webcam.
3.  **Inference:** The frame is passed through the Tiny Face Detector and Expression Net.
4.  **Rendering:** React uses the coordinate data (`x`, `y`, `width`, `height`) to draw the AR layer over the video feed.

## 📸 Screenshots

## 🤝 Credits
* [face-api.js](https://github.com/justadudewhohacks/face-api.js) for the incredible models.