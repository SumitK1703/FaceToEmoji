import { useState, useRef, useEffect } from 'react';
import './App.css';
import * as faceapi from 'face-api.js';
import { getQuote } from './quotes'; 

const emojiMap = {
  neutral: '😐',
  happy: '😀',
  sad: '😢',
  angry: '😡',
  fearful: '😨',
  disgusted: '🤢',
  surprised: '😲'
};

function App() {
  const videoRef = useRef();
  
  // --- REFS FOR STABILITY (NEW) ---
  const lastEmotionRef = useRef(""); // To track the previous emotion
  const frameRef = useRef(0);        // To count frames for age throttling
  
  // State
  const [currentEmoji, setCurrentEmoji] = useState("😐");
  const [currentQuote, setCurrentQuote] = useState("Show me your face...");
  const [faceBox, setFaceBox] = useState(null); 
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  // A. Load AI Models
  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/models')
      ]);
      startVideo();
    } catch (err) {
      console.error("Model Loading Failed", err);
    }
  };

  // B. Start Camera
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      })
      .catch((err) => console.error("Camera error:", err));
  };

  // C. The Detection Loop
  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current, 
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions()
        .withAgeAndGender();

        if (detections.length > 0) {
          const data = detections[0];
          
          // 1. AR Position (Keep this fast/smooth)
          setFaceBox(data.detection.box);

          // 2. Emotion Calculation
          const expressions = data.expressions;
          const maxEmotion = Object.keys(expressions).reduce((a, b) => 
            expressions[a] > expressions[b] ? a : b
          );
          
          // Always update emoji for responsiveness
          setCurrentEmoji(emojiMap[maxEmotion]);

          // --- STABILITY LOGIC START ---
          if (lastEmotionRef.current !== maxEmotion) {
            const newQuote = getQuote(maxEmotion);
            setCurrentQuote(newQuote);
            lastEmotionRef.current = maxEmotion; // Remember this emotion
          }
          frameRef.current++;
          if (frameRef.current % 30 === 0) {
            setAge(Math.round(data.age));
            setGender(data.gender);
          }

        } else {
          setFaceBox(null);
        }
      }
    }, 100); 
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="app-container">
      <h1>Face Emotion Scanner</h1>
      
      <div className="video-wrapper">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          width="720" 
          height="560"
          onPlay={handleVideoOnPlay} 
        />
        
        {/* AR OVERLAY */}
        {faceBox && (
          <div 
            className="ar-layer"
            style={{
              width: faceBox.width,
              height: faceBox.height,
              left: faceBox.x,
              top: faceBox.y,
            }}
          >
            {/* Show Age/Gender only if we have data */}
            {age && (
              <div className="info-badge">
                {gender} ({age})
              </div>
            )}
            <div className="emoji-face">
               {currentEmoji}
            </div>
          </div>
        )}
      </div>

      <div className="quote-section">
        <p>"{currentQuote}"</p>
      </div>
    </div>
  )
}

export default App;