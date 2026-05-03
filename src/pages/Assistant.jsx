import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, Bot, User, Mic, MicOff, Info, Globe, 
  Trash2, Download, Copy 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { ref, push, onValue, set } from 'firebase/database';
import './Assistant.css';

export default function Assistant({ apiKey, modelName, language, handleSend, messages, setMessages, isLoading, isListening, toggleListening }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const clearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
    }
  };

  return (
    <div className="assistant-page">
      <div className="chat-header">
        <div className="header-info">
          <h2>AI Civic Assistant</h2>
          <div className="status-badge">
            <div className="dot"></div>
            <span>{apiKey ? 'Cloud Connected' : 'Offline Mode'}</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={clearChat} title="Clear Chat"><Trash2 size={18} /></button>
        </div>
      </div>

      <div className="chat-container" ref={chatContainerRef}>
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              className="welcome-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="bot-avatar large">
                <Bot size={40} />
              </div>
              <h1>How can I help you today?</h1>
              <p>Ask anything about voter registration, polling locations, or election laws.</p>
              <div className="suggested-grid">
                <button onClick={() => handleSend("How do I register to vote?")}>How do I register?</button>
                <button onClick={() => handleSend("What ID do I need?")}>ID Requirements</button>
                <button onClick={() => handleSend("Find my polling station")}>Polling Stations</button>
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`message-wrapper ${msg.role === 'user' ? 'user' : 'ai'}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <div className="avatar">
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <span className="sender">{msg.role === 'user' ? 'You' : 'CivicAI'}</span>
                </div>
                <div className="text">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div className="message-wrapper ai">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="input-area">
        <div className="input-container">
          <button 
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title="Voice Input"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <input
            type="text"
            className="chat-input"
            placeholder={`Ask in ${language}...`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleSend(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
          
          <button className="send-btn" onClick={() => {
            const input = document.querySelector('.chat-input');
            if (input.value.trim()) {
              handleSend(input.value.trim());
              input.value = '';
            }
          }}>
            <Send size={20} />
          </button>
        </div>
        <p className="input-footer">CivicAI provides non-partisan educational information.</p>
      </div>
    </div>
  );
}
