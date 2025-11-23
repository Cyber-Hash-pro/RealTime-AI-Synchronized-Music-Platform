import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, Image as ImageIcon, X, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';

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

  const validateForm = () => {
    if (!file) return 'Please upload an audio file';
    if (!formData.title.trim()) return 'Title is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) return setErrorState(validationError);

    setIsUploading(true);
    setUploadProgress(0);
    clearError();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('music', file);
    if (coverImage) data.append('coverImage', coverImage);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/music/upload",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(percent);
          }
        }
      );

      setUploadStatus('success');
      setStatusMessage("Music uploaded successfully!");

      console.log("Uploaded:", res.data);

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
        clearError();
      }, 2500);

    } catch (err) {
      console.error("Upload Error:", err);
      setErrorState(err.response?.data?.message || "Upload failed");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto px-4">

      <h1 className="text-3xl font-bold text-white mb-2">Upload Music</h1>
      <p className="text-gray-400 mb-6">Share your music with the world</p>

      {uploadStatus && (
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

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full mt-2">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
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
              } />

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
                    <input type="file" accept="audio/*" className="hidden" id="audioUpload" onChange={handleChange} />
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

            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isUploading || !file || !formData.title.trim()}>
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
