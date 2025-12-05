import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

// Motivational messages for each mood
const moodMessages = {
  sad: {
    emoji: "😢",
    title: "Hey, It's Okay...",
    message: "\"Don't be sad\" isn't just a phrase, it's a way of life. Every storm runs out of rain. You're stronger than you know! 💪",
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  happy: {
    emoji: "😊",
    title: "You're Glowing!",
    message: "That smile is absolutely amazing! Your positive energy lights up the world. Keep spreading that beautiful vibe! ✨",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
  },
  neutral: {
    emoji: "😐",
    title: "Stay Balanced",
    message: "Peace of mind is the greatest treasure. In stillness, you find your strength. Embrace the calm within you. 🧘",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)"
  },
  angry: {
    emoji: "😤",
    title: "Take a Deep Breath",
    message: "Anger management is the key to success. Channel that fire into fuel for greatness. You've got the power to transform! 🔥",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)"
  },
  fearful: {
    emoji: "😨",
    title: "Courage Lives in You",
    message: "Fear is just excitement in disguise. Every brave person felt fear but chose to move forward anyway. You've got this! 🦁",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
  },
  disgusted: {
    emoji: "🤢",
    title: "Reset & Refresh",
    message: "Sometimes life throws us off. Take a moment, breathe deep, and remember - every moment is a chance to start fresh! 🌱",
    color: "#84cc16",
    gradient: "linear-gradient(135deg, #84cc16 0%, #22c55e 100%)"
  },
  surprised: {
    emoji: "😲",
    title: "Embrace the Unexpected!",
    message: "Life is full of beautiful surprises! Stay curious, stay open, and let wonder guide your journey. The best is yet to come! 🎉",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)"
  }
};

export default function FaceExpressionDetector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [expressions, setExpressions] = useState(null);
  const [dominantMood, setDominantMood] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [confirmedMood, setConfirmedMood] = useState(null);

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  // Load Models
  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      console.log("Models Loaded");
      setModelsLoaded(true);
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  // Start Webcam
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  };

  // Detect Expressions continuously
  useEffect(() => {
    if (!modelsLoaded || !videoRef.current) return;

    const detectExpressions = async () => {
      const video = videoRef.current;
      if (!video || video.paused || video.ended) return;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        setFaceDetected(true);
        const exprs = detections[0].expressions;
        setExpressions(exprs);

        // Find dominant mood
        const entries = Object.entries(exprs);
        const highest = entries.reduce((prev, curr) =>
          curr[1] > prev[1] ? curr : prev
        );
        setDominantMood({
          mood: highest[0],
          confidence: highest[1]
        });
      } else {
        setFaceDetected(false);
        setExpressions(null);
        setDominantMood(null);
      }
    };

    const interval = setInterval(detectExpressions, 200);
    return () => clearInterval(interval);
  }, [modelsLoaded]);

  // Handle mood confirmation
  const handleConfirmMood = () => {
    if (dominantMood) {
      setConfirmedMood(dominantMood.mood);
      setShowMessage(true);
    }
  };

  // Close message
  const handleCloseMessage = () => {
    setShowMessage(false);
    setConfirmedMood(null);
  };

  const currentMoodData = confirmedMood ? moodMessages[confirmedMood] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{
          color: "#fff",
          fontSize: "2.5rem",
          fontWeight: "700",
          margin: "0",
          textShadow: "0 0 20px rgba(99, 102, 241, 0.5)"
        }}>
          🎭 Mood Detector
        </h1>
        <p style={{ color: "#a5b4fc", fontSize: "1.1rem", marginTop: "10px" }}>
          Let your face tell your story
        </p>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px"
      }}>
        {/* Video Container */}
        <div style={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: faceDetected 
            ? "0 0 40px rgba(16, 185, 129, 0.4)" 
            : "0 0 40px rgba(239, 68, 68, 0.3)",
          border: faceDetected 
            ? "3px solid #10b981" 
            : "3px solid #ef4444",
          transition: "all 0.3s ease"
        }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            width="480"
            height="360"
            style={{ display: "block" }}
          />
          
          {/* Face Detection Indicator */}
          <div style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: faceDetected ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)",
            padding: "8px 15px",
            borderRadius: "20px",
            transition: "all 0.3s ease"
          }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#fff",
              animation: "pulse 1.5s infinite"
            }} />
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>
              {faceDetected ? "Face Detected" : "No Face"}
            </span>
          </div>

          {/* Real-time Mood Display */}
          {dominantMood && faceDetected && (
            <div style={{
              position: "absolute",
              bottom: "15px",
              left: "50%",
              transform: "translateX(-50%)",
              background: moodMessages[dominantMood.mood]?.gradient || "rgba(0,0,0,0.8)",
              padding: "12px 25px",
              borderRadius: "25px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{ fontSize: "24px" }}>
                {moodMessages[dominantMood.mood]?.emoji || "🎭"}
              </span>
              <span style={{ color: "#fff", fontSize: "18px", fontWeight: "600", textTransform: "capitalize" }}>
                {dominantMood.mood}
              </span>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
                {(dominantMood.confidence * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>

        {/* Confirm Button */}
        {faceDetected && dominantMood && !showMessage && (
          <button
            onClick={handleConfirmMood}
            style={{
              background: moodMessages[dominantMood.mood]?.gradient || "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              padding: "15px 40px",
              borderRadius: "30px",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            <span style={{ fontSize: "24px" }}>{moodMessages[dominantMood.mood]?.emoji}</span>
            Yes, I'm feeling {dominantMood.mood}!
          </button>
        )}

        {/* Expression Bars */}
        {expressions && faceDetected && !showMessage && (
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "25px",
            width: "100%",
            maxWidth: "500px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <h3 style={{ color: "#fff", margin: "0 0 20px 0", textAlign: "center" }}>
              Expression Analysis
            </h3>
            {Object.entries(expressions).map(([key, value]) => (
              <div key={key} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ color: "#a5b4fc", textTransform: "capitalize", fontSize: "14px" }}>
                    {moodMessages[key]?.emoji} {key}
                  </span>
                  <span style={{ color: "#fff", fontSize: "14px" }}>
                    {(value * 100).toFixed(1)}%
                  </span>
                </div>
                <div style={{
                  height: "8px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${value * 100}%`,
                    background: moodMessages[key]?.gradient || "linear-gradient(90deg, #6366f1, #8b5cf6)",
                    borderRadius: "10px",
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Motivational Message Modal */}
        {showMessage && currentMoodData && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}>
            <div style={{
              background: currentMoodData.gradient,
              borderRadius: "30px",
              padding: "40px",
              maxWidth: "500px",
              textAlign: "center",
              animation: "slideUp 0.5s ease",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
            }}>
              <div style={{ fontSize: "80px", marginBottom: "20px" }}>
                {currentMoodData.emoji}
              </div>
              <h2 style={{
                color: "#fff",
                fontSize: "2rem",
                margin: "0 0 15px 0",
                textShadow: "0 2px 10px rgba(0,0,0,0.2)"
              }}>
                {currentMoodData.title}
              </h2>
              <p style={{
                color: "rgba(255, 255, 255, 0.95)",
                fontSize: "1.2rem",
                lineHeight: "1.8",
                margin: "0 0 30px 0"
              }}>
                {currentMoodData.message}
              </p>
              <button
                onClick={handleCloseMessage}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  padding: "12px 35px",
                  borderRadius: "25px",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.3)";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Thank You! 🙏
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {!modelsLoaded && (
          <div style={{
            color: "#a5b4fc",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <div style={{
              width: "20px",
              height: "20px",
              border: "3px solid #6366f1",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            Loading AI Models...
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}