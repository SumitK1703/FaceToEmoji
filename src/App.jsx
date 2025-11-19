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
  const lastEmotionRef = useRef("");
  const frameRef = useRef(0);
  
  const [currentEmoji, setCurrentEmoji] = useState("😐");
  const [currentQuote, setCurrentQuote] = useState("Waiting for face...");
  const [faceBox, setFaceBox] = useState(null); 
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/models')
      ]);
      startVideo();
    } catch (err) {
      console.error(err);
    }
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: "user" } 
    })
      .then((currentStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      })
      .catch((err) => console.error(err));
  };

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
          const displaySize = {
            width: videoRef.current.offsetWidth,
            height: videoRef.current.offsetHeight
          };

          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          const data = resizedDetections[0];
          
          setFaceBox(data.detection.box);

          const expressions = data.expressions;
          const maxEmotion = Object.keys(expressions).reduce((a, b) => 
            expressions[a] > expressions[b] ? a : b
          );
          
          setCurrentEmoji(emojiMap[maxEmotion]);

          if (lastEmotionRef.current !== maxEmotion) {
            const newQuote = getQuote(maxEmotion);
            setCurrentQuote(newQuote);
            lastEmotionRef.current = maxEmotion;
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
          onPlay={handleVideoOnPlay} 
        />
        
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