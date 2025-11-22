import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, Image as ImageIcon, X, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

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
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (uploadedFile) => {
    // Check if file is audio
    if (uploadedFile.type.startsWith('audio/')) {
      // Check file size (20MB limit)
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      if (uploadedFile.size > maxSize) {
        setUploadStatus('error');
        setStatusMessage('File size exceeds 20MB limit');
        return;
      }
      setFile(uploadedFile);
      setUploadStatus(null);
      setStatusMessage('');
    } else {
      setUploadStatus('error');
      setStatusMessage('Please upload an audio file (MP3, WAV, etc.)');
    }
  };

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      if (uploadedFile.type.startsWith('image/')) {
        // Check image size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (uploadedFile.size > maxSize) {
          setUploadStatus('error');
          setStatusMessage('Image size exceeds 5MB limit');
          return;
        }
        setCoverImage(uploadedFile);
        setUploadStatus(null);
        setStatusMessage('');
      } else {
        setUploadStatus('error');
        setStatusMessage('Please upload an image file (JPG, PNG)');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!file) return 'Please select an audio file to upload';
    if (!formData.title.trim()) return 'Track title is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setUploadStatus('error');
      setStatusMessage(validationError);
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    setStatusMessage('');

    try {
      // Simulate upload progress (you can replace this with actual progress tracking)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Prepare upload data - only title is supported
      const uploadData = {
        music: file,
        coverImage: coverImage,
        title: formData.title.trim()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Simulate successful upload
      setUploadStatus('success');
      setStatusMessage('Track uploaded successfully!');
      
      // Reset form after successful upload
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
        setUploadStatus(null);
        setStatusMessage('');
      }, 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setStatusMessage('Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Music</h1>
        <p className="text-gray-400">Share your latest tracks with the world</p>
      </div>

      {/* Status Message */}
      {(uploadStatus || statusMessage) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            uploadStatus === 'success' 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}
        >
          {uploadStatus === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className={`text-sm ${
            uploadStatus === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {statusMessage}
          </span>
        </motion.div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Uploading...</span>
            <span className="text-white">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cover Image Upload */}
          <div className="lg:col-span-1">
            <label className="text-sm font-medium text-gray-400 mb-2 block">Cover Image</label>
            <Card className="w-full h-64 lg:h-80 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleCoverChange} 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                disabled={isUploading}
              />
              {coverImage ? (
                <div className="absolute inset-0">
                  <img 
                    src={URL.createObjectURL(coverImage)} 
                    alt="Cover Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-medium">Change Cover</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4 group-hover:text-green-500 transition-colors">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-sm font-medium text-white mb-2">Upload Cover Image</p>
                  <p className="text-xs text-gray-400">JPG, PNG (Max 5MB)</p>
                  <p className="text-xs text-gray-400 mt-1">Optional</p>
                </div>
              )}
            </Card>
          </div>

          {/* Track Details & Audio Upload */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: 'Midnight Dreams',
                    artist: 'John Doe',
                    genre: 'Electronic',
                    description: 'A dreamy electronic track perfect for late night vibes'
                  });
                  // Create a dummy file object for demo
                  const dummyFile = new File(['dummy'], 'midnight-dreams.mp3', { type: 'audio/mpeg' });
                  Object.defineProperty(dummyFile, 'size', { value: 5242880 }); // 5MB
                  setFile(dummyFile);
                  
                  // Create a dummy image for cover
                  const canvas = document.createElement('canvas');
                  canvas.width = 300;
                  canvas.height = 300;
                  const ctx = canvas.getContext('2d');
                  ctx.fillStyle = '#1DB954';
                  ctx.fillRect(0, 0, 300, 300);
                  ctx.fillStyle = 'white';
                  ctx.font = '24px Arial';
                  ctx.textAlign = 'center';
                  ctx.fillText('Midnight', 150, 130);
                  ctx.fillText('Dreams', 150, 170);
                  canvas.toBlob((blob) => {
                    const dummyCover = new File([blob], 'cover.png', { type: 'image/png' });
                    setCoverImage(dummyCover);
                  });
                }}
                className="text-sm px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors font-medium"
                disabled={isUploading}
              >
                Load Demo Data
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Track Title"
                name="title"
                placeholder="Enter track title"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={isUploading}
              />
              
              <Input
                label="Artist Name"
                name="artist"
                placeholder="Your artist name"
                value={formData.artist}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Genre"
                name="genre"
                placeholder="e.g. Electronic, Pop, Rock"
                value={formData.genre}
                onChange={handleInputChange}
                disabled={isUploading}
              />
              
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Description</label>
                <textarea
                  name="description"
                  placeholder="Tell us about your track..."
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isUploading}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">Audio File</label>
              <div 
                className={`min-h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors p-6 ${
                  dragActive 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-gray-600 bg-gray-800 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg w-full max-w-md relative">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black shrink-0">
                      <Music size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    {!isUploading && (
                      <button 
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-gray-400 hover:text-red-400 shrink-0"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <input 
                      type="file" 
                      accept="audio/*" 
                      onChange={handleChange} 
                      className="hidden" 
                      id="audio-upload"
                      disabled={isUploading}
                    />
                    <label htmlFor="audio-upload" className="cursor-pointer text-center flex flex-col items-center justify-center w-full">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 mb-4">
                        <Upload size={32} />
                      </div>
                      <p className="text-white font-medium mb-2">Drag & drop or click to upload</p>
                      <p className="text-sm text-gray-400">MP3, WAV, FLAC (Max 20MB)</p>
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={!file || !formData.title.trim() || isUploading}
                className="px-8 py-3"
              >
                {isUploading ? 'Uploading...' : 'Upload Track'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default UploadMusic;
