// App.js
import React, { useState } from 'react';
import { MessageSquare, Clock, Upload, Zap, Search } from 'lucide-react';
import Lottie from "lottie-react";
import orbAnimation from "./assets/animations/Orb Animation.json";
import FileUpload from "./assets/components/fileupload";

const AIRAGDashboard = () => {
  const [activeButton, setActiveButton] = useState('Chatbot');
  const [inputValue, setInputValue] = useState('');

  const menuItems = [
    { name: 'Chatbot', icon: MessageSquare },
    { name: 'History', icon: Clock },
    { name: 'File Upload', icon: Upload }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 flex overflow-hidden">
      
      {/* Left Panel - stays same */}
      <div className="w-[30%] flex flex-col h-screen bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm border-r border-blue-500/20 animate-fade-in-left">
        {/* Logo Section */}
        <div className="h-[30%] flex items-center justify-center p-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/50 flex items-center justify-center animate-pulse-glow">
            <Zap className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Middle Section */}
        <div className="h-[60%] flex flex-col px-6">
          <div className="h-[20%] flex items-center justify-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
              AI-RAG
            </h1>
          </div>

          {/* Navigation Buttons */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {menuItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => setActiveButton(item.name)}
                className={`w-full h-14 rounded-xl flex items-center justify-center space-x-3 text-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fade-in-up ${
                  activeButton === item.name
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400/50'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-600/30 hover:border-blue-500/30'
                }`}
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-[10%]" />
      </div>

      {/* Right Panel - changes depending on activeButton */}
      <div className="w-[70%] flex flex-col h-screen bg-gradient-to-br from-gray-900/30 to-blue-900/30 backdrop-blur-sm relative animate-fade-in-right">

        {/* Chatbot UI */}
        {activeButton === 'Chatbot' && (
          <div className="flex-1 flex flex-col items-center justify-center px-12 pb-12 pt-24">
            {/* Orb Animation */}
            <div className="mb-12 flex justify-center items-center mt-10">
              <Lottie animationData={orbAnimation} loop={true} style={{ width: 200, height: 200 }} />
            </div>

            {/* Welcome Text */}
            <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent text-center animate-fade-in-up">
              Welcome back Alex!
            </h2>

            {/* Input Bar */}
            <div className="w-full max-w-2xl animate-fade-in-up">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 shadow-lg shadow-blue-500/20 rounded-2xl overflow-hidden">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-blue-400" />
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about your data..."
                    className="w-full h-16 pl-12 pr-20 bg-transparent border-0 text-white placeholder:text-gray-400 text-lg focus:ring-0 focus:outline-none"
                  />
                  <button className="absolute right-2 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95">
                    <Zap className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm mt-6 text-center max-w-lg animate-fade-in">
              Powered by advanced AI technology to help you interact with your data intelligently
            </p>
          </div>
        )}

        {/* File Upload UI */}
        {activeButton === 'File Upload' && (
          <FileUpload />
        )}

        {/* History UI (placeholder for now) */}
        {activeButton === 'History' && (
          <div className="flex-1 flex items-center justify-center text-white text-2xl">
            History page coming soon...
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-left {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in-right {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out 0.3s both;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.6s both;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AIRAGDashboard;
