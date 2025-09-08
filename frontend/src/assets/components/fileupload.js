import React, { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, CloudUpload } from 'lucide-react';

// Toast Component
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl backdrop-blur-sm border shadow-lg transform transition-all duration-300 animate-slide-in ${
    type === 'success' 
      ? 'bg-green-900/30 border-green-500/50 text-green-300 shadow-green-500/20' 
      : 'bg-red-900/30 border-red-500/50 text-red-300 shadow-red-500/20'
  }`} style={{
    boxShadow: type === 'success' 
      ? '0 0 20px rgba(34, 197, 94, 0.3)' 
      : '0 0 20px rgba(239, 68, 68, 0.3)'
  }}>
    <div className="flex items-center space-x-3">
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Main File Upload Component
const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      showToast('File ready to upload', 'success');
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
  if (!selectedFile) {
    showToast('Please select a file first', 'error');
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("http://127.0.0.1:8000/api/files/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      showToast("File uploaded successfully!", "success");
      console.log("Uploaded file URL:", result.url);
    } else {
      showToast(`Upload failed: ${result.detail}`, "error");
    }
  } catch (err) {
    console.error(err);
    showToast("An error occurred while uploading", "error");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 p-8 flex items-center justify-center">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Main Upload Card */}
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 shadow-2xl shadow-blue-500/20 rounded-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border-b border-blue-500/30 px-8 py-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent flex items-center space-x-3">
              <CloudUpload className="w-8 h-8 text-blue-400" />
              <span>Upload Files for Training</span>
            </h2>
            <p className="text-gray-400 mt-2">Select files to train your AI model</p>
          </div>

          {/* Upload Content */}
          <div className="p-8 space-y-6">
            
            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group animate-scale-in ${
                isDragOver 
                  ? 'border-blue-400/80 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-600/50 hover:border-blue-500/50 hover:bg-blue-500/5'
              }`}
              style={{
                boxShadow: isDragOver ? '0 0 30px rgba(59, 130, 246, 0.3)' : 'none'
              }}
            >
              <input
                type="file"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.txt,.csv,.json"
              />
              
              <div className="space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center transition-all duration-300 ${
                  isDragOver ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  <Upload className={`w-8 h-8 transition-colors duration-300 ${
                    isDragOver ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                  }`} />
                </div>
                
                <div>
                  <p className={`text-lg font-medium transition-colors duration-300 ${
                    isDragOver ? 'text-blue-300' : 'text-gray-300 group-hover:text-white'
                  }`}>
                    {isDragOver ? 'Drop your file here' : 'Drag & drop your file here'}
                  </p>
                  <p className="text-gray-500 mt-1">or click to browse</p>
                </div>
                
                <p className="text-sm text-gray-500">
                  Supports: PDF, DOC, DOCX, TXT, CSV, JSON
                </p>
              </div>
            </div>

            {/* Selected File Display */}
            {selectedFile && (
              <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-4 animate-slide-up">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <File className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center space-x-3"
            >
              <CloudUpload className="w-5 h-5" />
              <span>Upload File</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes slide-in {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out 0.2s both;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FileUpload;