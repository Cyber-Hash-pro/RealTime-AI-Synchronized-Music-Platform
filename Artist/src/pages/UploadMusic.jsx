import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, Image as ImageIcon, X, AlertCircle, CheckCircle, Zap, Loader, Cpu } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import { MUSIC_API } from '../config/api';

const MOOD_OPTIONS = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];

const UploadMusic = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: 'John Doe',
    genre: '',
    description: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [moodDetecting, setMoodDetecting] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [uploadStage, setUploadStage] = useState(null); // 'mood-detecting', 'uploading', 'complete'
  const [moodSelectionMode, setMoodSelectionMode] = useState('manual'); // 'manual' or 'ai'
  const [selectedMood, setSelectedMood] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (uploadedFile) => {
    if (uploadedFile.type.startsWith('audio/')) {
      if (uploadedFile.size > 20 * 1024 * 1024) {
        return setErrorState('File size exceeds 20MB limit');
      }
      setFile(uploadedFile);
      clearError();
    } else {
      setErrorState('Please upload a valid audio file');
    }
  };

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      if (!img.type.startsWith('image/')) return setErrorState('Upload JPG or PNG image only');
      if (img.size > 5 * 1024 * 1024) return setErrorState('Image size exceeds 5MB');

      setCoverImage(img);
      clearError();
    }
  };

  const setErrorState = (msg) => {
    setUploadStatus('error');
    setStatusMessage(msg);
  };

  const clearError = () => {
    setUploadStatus(null);
    setStatusMessage('');
  };

  // Get mood color and emoji
  const getMoodStyle = (mood) => {
    const moodColors = {
      'happy': { bg: 'from-yellow-400 to-orange-400', text: 'text-yellow-100', emoji: '😊' },
      'sad': { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-100', emoji: '😢' },
      'angry': { bg: 'from-red-500 to-red-700', text: 'text-red-100', emoji: '😠' },
      'fearful': { bg: 'from-purple-600 to-purple-800', text: 'text-purple-100', emoji: '😨' },
      'disgusted': { bg: 'from-green-600 to-emerald-700', text: 'text-green-100', emoji: '🤢' },
      'surprised': { bg: 'from-pink-400 to-rose-500', text: 'text-pink-100', emoji: '😮' },
      'neutral': { bg: 'from-gray-500 to-gray-700', text: 'text-gray-100', emoji: '😐' }
    };
    return moodColors[mood?.toLowerCase()] || moodColors['neutral'];
  };

  const validateForm = () => {
    if (!file) return 'Please upload an audio file';
    if (!formData.title.trim()) return 'Title is required';
    if (moodSelectionMode === 'manual' && !selectedMood) return 'Please select a mood';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) return setErrorState(validationError);

    setIsUploading(true);
    setUploadProgress(0);
    setDetectedMood(null);
    clearError();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('music', file);
    data.append('moodMode', moodSelectionMode); // 'manual' or 'ai'
    if (moodSelectionMode === 'manual') {
      data.append('mood', selectedMood); // User selected mood
    }
    if (coverImage) data.append('coverImage', coverImage);

    try {
      if (moodSelectionMode === 'ai') {
        setUploadStage('mood-detecting');
        setMoodDetecting(true);

        // Simulate mood detection progress
        let moodProgress = 0;
        const moodInterval = setInterval(() => {
          moodProgress += Math.random() * 40;
          if (moodProgress > 85) moodProgress = 85;
          setUploadProgress(Math.floor(moodProgress));
        }, 300);

        const res = await axios.post(
          `${MUSIC_API}/upload`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              clearInterval(moodInterval);
              setUploadStage('uploading');
              setMoodDetecting(false);
              // Mood detection complete, start file upload from 40%
              const percent = 40 + Math.round((progressEvent.loaded / progressEvent.total) * 60);
              setUploadProgress(percent);
            }
          }
        );

        // Extract mood from response
        const mood = res.data.music.mood;
        setDetectedMood(mood);
        setUploadProgress(100);
        setUploadStage('complete');

        setUploadStatus('success');
        setStatusMessage(`Music uploaded successfully! Detected mood: ${mood?.toUpperCase()}`);

        console.log("Uploaded:", res.data);
      } else {
        // Manual mood selection - direct upload without AI detection
        setUploadStage('uploading');
        setUploadProgress(20);

        const res = await axios.post(
          `${MUSIC_API}/upload`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percent = 20 + Math.round((progressEvent.loaded / progressEvent.total) * 80);
              setUploadProgress(percent);
            }
          }
        );

        setDetectedMood(selectedMood);
        setUploadProgress(100);
        setUploadStage('complete');

        setUploadStatus('success');
        setStatusMessage(`Music uploaded successfully! Mood: ${selectedMood?.toUpperCase()}`);

        console.log("Uploaded:", res.data);
      }

      setTimeout(() => {
        setFile(null);
        setCoverImage(null);
        setFormData({
          title: '',
          artist: 'John Doe',
          genre: '',
          description: ''
        });
        setUploadProgress(0);
        setDetectedMood(null);
        setUploadStage(null);
        setSelectedMood(null);
        setMoodSelectionMode('manual');
        clearError();
      }, 3000);

    } catch (err) {
      console.error("Upload Error:", err);
      setErrorState(err.response?.data?.message || "Upload failed");
      setUploadProgress(0);
      setUploadStage(null);
      setMoodDetecting(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto px-4">

      <h1 className="text-3xl font-bold text-white mb-2">Upload Music</h1>
      <p className="text-gray-400 mb-6">Share your music with the world</p>

      {/* UPLOAD PROGRESS & MOOD DETECTION UI */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700"
        >
          {/* Stage Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {moodDetecting ? (
                <>
                  <Loader className="text-purple-400 animate-spin" size={24} />
                  <div>
                    <p className="text-white font-semibold">AI Mood Detection</p>
                    <p className="text-gray-400 text-sm">Analyzing audio characteristics...</p>
                  </div>
                </>
              ) : uploadStage === 'uploading' ? (
                <>
                  <Upload className="text-green-400" size={24} />
                  <div>
                    <p className="text-white font-semibold">Uploading Music</p>
                    <p className="text-gray-400 text-sm">Storing your file...</p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle className="text-green-400" size={24} />
                  <div>
                    <p className="text-white font-semibold">Complete!</p>
                    <p className="text-gray-400 text-sm">Your music is ready</p>
                  </div>
                </>
              )}
            </div>
            <span className="text-2xl font-bold text-white">{uploadProgress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-green-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>

          {/* Detected Mood Display */}
          {detectedMood && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-gradient-to-br ${getMoodStyle(detectedMood).bg} p-6 rounded-lg text-center`}
            >
              <div className="text-6xl mb-3">{getMoodStyle(detectedMood).emoji}</div>
              <p className={`text-sm font-semibold mb-1 ${getMoodStyle(detectedMood).text}`}>DETECTED MOOD</p>
              <p className={`text-2xl font-bold ${getMoodStyle(detectedMood).text}`}>{detectedMood?.toUpperCase()}</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {uploadStatus && !isUploading && (
        <div className={`p-4 rounded-lg mb-4 flex gap-3 ${uploadStatus === "success"
          ? "bg-green-500/10 border border-green-500/20"
          : "bg-red-500/10 border border-red-500/20"}`}>
          {uploadStatus === "success"
            ? <CheckCircle className="text-green-400" />
            : <AlertCircle className="text-red-400" />}
          <span className={uploadStatus === "success" ? "text-green-400" : "text-red-400"}>
            {statusMessage}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* COVER UPLOAD */}
          <div className="md:col-span-1">
            <label className="text-gray-400 text-sm mb-2 block">Cover Image</label>
            <Card className="h-64 flex items-center justify-center relative cursor-pointer">
              <input type="file" accept="image/*" onChange={handleCoverChange}
                disabled={isUploading} className="absolute inset-0 opacity-0 cursor-pointer" />

              {!coverImage ? (
                <div className="text-center text-gray-300">
                  <ImageIcon size={34} className="mx-auto mb-3" />
                  <p>Upload Cover</p>
                  <p className="text-gray-500 text-xs">JPG, PNG (Max 5MB)</p>
                </div>
              ) : (
                <img src={URL.createObjectURL(coverImage)} className="w-full h-full object-cover rounded-lg" />
              )}
            </Card>
          </div>

          {/* DETAILS + MUSIC UPLOAD */}
          <div className="md:col-span-3 flex flex-col gap-4">

            <Input label="Track Title" name="title" placeholder="Enter track title"
              value={formData.title} onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              } disabled={isUploading} />

            {/* AUDIO UPLOAD */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Audio File</label>

              <div
                className={`p-6 border-2 border-dashed rounded-xl 
                  ${dragActive ? "border-green-500 bg-green-500/10" : "border-gray-600 bg-gray-800"}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag}
                onDragOver={handleDrag} onDrop={handleDrop}
              >

                {!file ? (
                  <>
                    <input type="file" accept="audio/*" className="hidden" id="audioUpload" onChange={handleChange} disabled={isUploading} />
                    <label htmlFor="audioUpload" className="cursor-pointer text-center text-gray-300">
                      <Upload size={30} className="mx-auto mb-2" />
                      <p>Drag & drop or click to upload</p>
                    </label>
                  </>
                ) : (
                  <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg">
                    <Music className="text-green-400" />
                    <div className="flex-1">
                      <p className="text-white truncate">{file.name}</p>
                      <p className="text-gray-400 text-xs">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    {!isUploading && (
                      <X className="text-red-400 cursor-pointer" onClick={() => setFile(null)} />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* MOOD SELECTION - Two Options */}
            <div className="space-y-4">
              <label className="text-gray-400 text-sm block">Mood Selection</label>
              
              {/* Mode Toggle Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMoodSelectionMode('manual');
                    setDetectedMood(null);
                  }}
                  disabled={isUploading}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    moodSelectionMode === 'manual'
                      ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                      : 'bg-gray-700 border-2 border-gray-600 text-gray-300 hover:border-gray-500'
                  } disabled:opacity-50`}
                >
                  Manual Selection
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMoodSelectionMode('ai');
                    setSelectedMood(null);
                  }}
                  disabled={isUploading}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    moodSelectionMode === 'ai'
                      ? 'bg-purple-500/20 border-2 border-purple-500 text-purple-400'
                      : 'bg-gray-700 border-2 border-gray-600 text-gray-300 hover:border-gray-500'
                  } disabled:opacity-50`}
                >
                  <Cpu size={18} />
                  AI Detection
                </button>
              </div>

              {/* Manual Mood Selection Dropdown */}
              {moodSelectionMode === 'manual' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <select
                    value={selectedMood || ''}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    disabled={isUploading}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition disabled:opacity-50"
                  >
                    <option value="">Select a mood...</option>
                    {MOOD_OPTIONS.map(mood => (
                      <option key={mood} value={mood}>
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </option>
                    ))}
                  </select>

                  {/* Selected Mood Preview */}
                  {selectedMood && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`bg-gradient-to-br ${getMoodStyle(selectedMood).bg} p-4 rounded-lg text-center mt-3`}
                    >
                      <div className="text-4xl mb-2">{getMoodStyle(selectedMood).emoji}</div>
                      <p className={`text-sm font-semibold ${getMoodStyle(selectedMood).text}`}>
                        {selectedMood?.toUpperCase()}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* AI Detection Info */}
              {moodSelectionMode === 'ai' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg"
                >
                  <p className="text-sm text-purple-300 flex items-start gap-2">
                    <Cpu size={16} className="mt-0.5 flex-shrink-0" />
                    <span>AI will automatically detect mood when you upload. This may take a few seconds.</span>
                  </p>
                </motion.div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={isUploading || !file || !formData.title.trim() || (moodSelectionMode === 'manual' && !selectedMood)}
              >
                {isUploading ? "Uploading..." : "Upload Track"}
              </Button>
            </div>

          </div>

        </div>
      </form>
    </motion.div>
  );
};

export default UploadMusic;
