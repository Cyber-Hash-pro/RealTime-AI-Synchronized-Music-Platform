import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import { FaCamera, FaSpinner, FaTimes, FaMusic, FaRedo } from 'react-icons/fa';

const MoodDetector = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fearful: '😨',
    disgusted: '🤢',
    surprised: '😲',
    neutral: '😐'
  };

  const moodColors = {
    happy: 'from-yellow-400 to-orange-500',
    sad: 'from-blue-400 to-indigo-600',
    angry: 'from-red-500 to-rose-700',
    fearful: 'from-purple-400 to-violet-600',
    disgusted: 'from-green-500 to-emerald-700',
    surprised: 'from-pink-400 to-fuchsia-600',
    neutral: 'from-gray-400 to-slate-600'
  };

  const moodDescriptions = {
    happy: 'Feeling joyful and upbeat!',
    sad: 'A bit melancholic today...',
    angry: 'Intense and powerful mood!',
    fearful: 'Feeling anxious or worried...',
    disgusted: 'Something bothering you?',
    surprised: 'Wow, unexpected vibes!',
    neutral: 'Cool and calm state of mind.'
  };

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingProgress(10);
        const MODEL_URL = '/models';
        
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setLoadingProgress(40);
        
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setLoadingProgress(70);
        
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        setLoadingProgress(100);
        
        setModelsLoaded(true);
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Failed to load face detection models');
      }
    };

    loadModels();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const detectMood = async () => {
    if (!videoRef.current || !modelsLoaded) return;
    
    setDetecting(true);
    setError(null);

    try {
      // Wait a moment for stable detection
      await new Promise(resolve => setTimeout(resolve, 500));

      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections) {
        const expressions = detections.expressions;
        
        // Find the mood with highest confidence
        let maxMood = 'neutral';
        let maxValue = 0;

        Object.entries(expressions).forEach(([mood, value]) => {
          if (value > maxValue) {
            maxValue = value;
            maxMood = mood;
          }
        });

        setDetectedMood({
          mood: maxMood,
          confidence: Math.round(maxValue * 100),
          allExpressions: expressions
        });

        // Draw on canvas
        if (canvasRef.current) {
          const displaySize = { 
            width: videoRef.current.videoWidth, 
            height: videoRef.current.videoHeight 
          };
          faceapi.matchDimensions(canvasRef.current, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        }

        stopCamera();
      } else {
        setError('No face detected. Please make sure your face is visible and try again.');
      }
    } catch (err) {
      console.error('Detection error:', err);
      setError('Failed to detect mood. Please try again.');
    } finally {
      setDetecting(false);
    }
  };

  const handleFindSongs = () => {
    if (detectedMood) {
      navigate(`/mood-songs/${detectedMood.mood}`);
    }
  };

  const resetDetection = () => {
    setDetectedMood(null);
    setError(null);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#0a0a0a] px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-[#282828] hover:bg-[#3e3e3e] transition-colors"
        >
          <FaTimes className="text-white text-xl" />
        </button>
        <h1 className="text-2xl font-bold text-white">Mood Detection 🎭</h1>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        {/* Loading Models */}
        {!modelsLoaded && (
          <div className="bg-[#181818] rounded-2xl p-8 text-center">
            <FaSpinner className="text-4xl text-[#1db954] animate-spin mx-auto mb-4" />
            <p className="text-white text-lg mb-4">Loading AI Models...</p>
            <div className="w-full bg-[#282828] rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-[#1db954] to-[#1ed760] h-2 rounded-full transition-all duration-500"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-[#b3b3b3] text-sm">{loadingProgress}%</p>
          </div>
        )}

        {/* Camera View */}
        {modelsLoaded && !detectedMood && (
          <div className="bg-[#181818] rounded-2xl overflow-hidden">
            {/* Video Container */}
            <div className="relative aspect-[4/3] bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#282828] to-[#181818]">
                  <div className="w-32 h-32 rounded-full bg-[#282828] flex items-center justify-center mb-6 border-4 border-dashed border-[#3e3e3e]">
                    <FaCamera className="text-5xl text-[#b3b3b3]" />
                  </div>
                  <p className="text-[#b3b3b3] text-center px-4">
                    Click the button below to start camera and detect your mood
                  </p>
                </div>
              )}

              {detecting && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-white text-lg">Analyzing your mood...</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-4 justify-center">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#1db954] to-[#1ed760] text-black font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
                  >
                    <FaCamera className="text-xl" />
                    Start Camera
                  </button>
                ) : (
                  <>
                    <button
                      onClick={stopCamera}
                      className="flex items-center gap-2 bg-[#282828] text-white px-6 py-4 rounded-full hover:bg-[#3e3e3e] transition-colors"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                    <button
                      onClick={detectMood}
                      disabled={detecting}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {detecting ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        '🎭'
                      )}
                      Detect Mood
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mood Result */}
        {detectedMood && (
          <div className="bg-[#181818] rounded-2xl overflow-hidden animate-fadeIn">
            {/* Mood Display */}
            <div className={`p-8 bg-gradient-to-r ${moodColors[detectedMood.mood]} text-center`}>
              <div className="text-8xl mb-4">{moodEmojis[detectedMood.mood]}</div>
              <h2 className="text-4xl font-bold text-white capitalize mb-2">
                {detectedMood.mood}
              </h2>
              <p className="text-white/80 text-lg">{moodDescriptions[detectedMood.mood]}</p>
              <div className="mt-4 inline-block bg-black/30 px-4 py-2 rounded-full">
                <span className="text-white font-medium">{detectedMood.confidence}% confident</span>
              </div>
            </div>

            {/* Expression Breakdown */}
            <div className="p-6">
              <h3 className="text-white font-semibold mb-4">Expression Analysis</h3>
              <div className="space-y-3">
                {Object.entries(detectedMood.allExpressions)
                  .sort(([, a], [, b]) => b - a)
                  .map(([mood, value]) => (
                    <div key={mood} className="flex items-center gap-3">
                      <span className="text-2xl w-8">{moodEmojis[mood]}</span>
                      <span className="text-[#b3b3b3] capitalize w-24">{mood}</span>
                      <div className="flex-1 bg-[#282828] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${moodColors[mood]}`}
                          style={{ width: `${Math.round(value * 100)}%` }}
                        />
                      </div>
                      <span className="text-[#b3b3b3] w-12 text-right">
                        {Math.round(value * 100)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0 flex gap-4">
              <button
                onClick={resetDetection}
                className="flex-1 flex items-center justify-center gap-2 bg-[#282828] text-white py-4 rounded-full hover:bg-[#3e3e3e] transition-colors"
              >
                <FaRedo />
                Try Again
              </button>
              <button
                onClick={handleFindSongs}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#1db954] to-[#1ed760] text-black font-bold py-4 rounded-full hover:scale-105 transition-transform"
              >
                <FaMusic />
                Find Songs
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 text-center text-[#b3b3b3]">
          <p className="text-sm">
            🔒 Your camera feed is processed locally and never uploaded
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MoodDetector;
