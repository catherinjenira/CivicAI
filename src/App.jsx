import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  X, Settings, Key, Globe, LayoutDashboard, 
  MessageSquare, BookOpen, Gamepad2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Firebase
import { db, auth } from './firebase';
import { ref, push, onValue } from 'firebase/database';

// Layout & Pages
import Sidebar from './layouts/Sidebar';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Practice from './pages/Practice';
import Resources from './pages/Resources';
import Login from './pages/Login';

// Components & Utils
import { getMockResponse } from './mockData';
import './App.css';

/**
 * System instruction for Gemini to maintain non-partisan educational persona.
 */
const SYSTEM_INSTRUCTION = `You are CivicAI, a smart, dynamic assistant dedicated to election process education. 
Your goal is to provide non-partisan, factual, and neutral information about voting, registration, and civic duties.
Always encourage civic participation without favoring any specific party or candidate.`;

/**
 * Main Application Component
 * Handles Global State, Authentication, and AI Logic.
 */
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('VITE_GEMINI_API_KEY') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [dailyFact, setDailyFact] = useState('');
  const [language, setLanguage] = useState('English');
  const [modelName, setModelName] = useState('models/gemini-1.5-flash');

  const recognitionRef = useRef(null);

  // Authentication Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Syncing
  useEffect(() => {
    if (user) {
      fetchDailyFact(apiKey);
      syncMessagesWithFirebase(user.uid);
    }
  }, [user, apiKey]);

  /**
   * Syncs chat messages with Firebase Realtime Database.
   * @param {string} uid - The user's unique identifier.
   */
  const syncMessagesWithFirebase = (uid) => {
    const chatRef = ref(db, `chats/${uid}`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMessages(messageList);
      }
    });
  };

  /**
   * Fetches a fascinating civic fact using Gemini 1.5 Flash.
   * Falls back to hardcoded fact if API is unavailable.
   */
  const fetchDailyFact = async (key) => {
    if (!key) {
      setDailyFact("In Ancient Greece, citizens used broken pottery to vote.");
      return;
    }
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = "Provide one short, fascinating, and neutral fact about the election process or voting history. Keep it under 100 characters.";
      const result = await model.generateContent(prompt);
      setDailyFact(result.response.text());
    } catch (error) {
      setDailyFact("In Ancient Greece, citizens used broken pottery to vote.");
    }
  };

  /**
   * Handles sending messages to Gemini AI with graceful fallback.
   * @param {string} text - User input text.
   */
  const handleSend = async (text) => {
    if (!text.trim() || !user) return;

    const userMsg = { id: Date.now(), role: 'user', text };
    const chatRef = ref(db, `chats/${user.uid}`);
    
    setMessages(prev => [...prev, userMsg]);
    try {
      push(chatRef, userMsg);
    } catch (fbError) {
      console.warn('Firebase sync failed');
    }

    setIsLoading(true);

    try {
      if (!apiKey) throw new Error("No API key");
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });

      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const chat = model.startChat({ history });
      const fullPrompt = `[SYSTEM: ${SYSTEM_INSTRUCTION} Respond in ${language}.]\n\nUser: ${text}`;
      const result = await chat.sendMessage(fullPrompt);
      
      const aiMsg = { id: Date.now() + 1, role: 'model', text: result.response.text() };
      setMessages(prev => [...prev, aiMsg]);
      
      try {
        push(chatRef, aiMsg);
      } catch (fbError) {
        console.warn('Firebase sync failed');
      }
    } catch (error) {
      const mockText = getMockResponse(text);
      const fallbackMsg = { id: Date.now() + 1, role: 'model', text: mockText };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggles Web Speech API for voice input.
   */
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };
    recognition.onend = () => setIsListening(false);
    
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('VITE_GEMINI_API_KEY', key);
    setShowSettings(false);
  };

  if (authLoading) {
    return (
      <div className="loading-screen" aria-live="polite">
        <div className="typing-indicator" aria-label="Loading CivicAI Content">
          <span></span><span></span><span></span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <div className="app-shell">
        <Sidebar 
          user={user}
          language={language} 
          setLanguage={setLanguage} 
          setShowSettings={setShowSettings} 
        />
        
        <main className="app-main" role="main">
          <Routes>
            <Route path="/" element={<Dashboard dailyFact={dailyFact} language={language} />} />
            <Route path="/assistant" element={
              <Assistant 
                apiKey={apiKey}
                modelName={modelName}
                language={language}
                handleSend={handleSend}
                messages={messages}
                setMessages={setMessages}
                isLoading={isLoading}
                isListening={isListening}
                toggleListening={toggleListening}
              />
            } />
            <Route path="/practice" element={<Practice />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <AnimatePresence>
          {showSettings && (
            <div className="modal-overlay" role="dialog" aria-labelledby="modal-title">
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="modal-header">
                  <h2 id="modal-title" className="modal-title">
                    <Key size={24} color="var(--primary)" aria-hidden="true" /> API Config
                  </h2>
                  <button 
                    className="close-btn" 
                    onClick={() => setShowSettings(false)}
                    aria-label="Close Settings"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="api-key-input">Gemini API Key</label>
                  <input 
                    type="password" 
                    id="api-key-input" 
                    className="form-input" 
                    defaultValue={apiKey} 
                    placeholder="AIzaSy..." 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="model-select">Model Selection</label>
                  <select 
                    id="model-select"
                    className="form-input" 
                    value={modelName} 
                    onChange={(e) => setModelName(e.target.value)}
                  >
                    <option value="models/gemini-1.5-flash">gemini-1.5-flash (Fast)</option>
                    <option value="models/gemini-pro">gemini-pro (Stable)</option>
                  </select>
                </div>
                
                <button 
                  className="btn-primary" 
                  onClick={() => handleSaveApiKey(document.getElementById('api-key-input').value)}
                  aria-label="Save API Configuration"
                >
                  Save & Continue
                </button>
                <button 
                  className="settings-btn" 
                  style={{marginTop: '1rem', width: '100%', justifyContent: 'center'}} 
                  onClick={() => setShowSettings(false)}
                  aria-label="Continue with Offline Mode"
                >
                  Skip for Offline Mode
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}
