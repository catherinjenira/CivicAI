import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnimatePresence } from 'framer-motion';

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

// Components
import ConfigModal from './components/ConfigModal';
import LoadingScreen from './components/LoadingScreen';

// Utils
import { getMockResponse } from './mockData';
import './App.css';

const SYSTEM_INSTRUCTION = `You are CivicAI, a smart, dynamic assistant dedicated to election process education. 
Your goal is to provide non-partisan, factual, and neutral information about voting, registration, and civic duties.`;

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchDailyFact(apiKey);
      syncMessagesWithFirebase(user.uid);
    }
  }, [user, apiKey]);

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

  const fetchDailyFact = async (key) => {
    if (!key) {
      setDailyFact("In Ancient Greece, citizens used broken pottery to vote.");
      return;
    }
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = "Provide one short, fascinating, and neutral fact about voting history. Under 100 characters.";
      const result = await model.generateContent(prompt);
      setDailyFact(result.response.text());
    } catch (error) {
      setDailyFact("In Ancient Greece, citizens used broken pottery to vote.");
    }
  };

  const handleSend = async (text) => {
    if (!text.trim() || !user) return;
    const userMsg = { id: Date.now(), role: 'user', text };
    const chatRef = ref(db, `chats/${user.uid}`);
    setMessages(prev => [...prev, userMsg]);
    try { push(chatRef, userMsg); } catch (e) {}

    setIsLoading(true);
    try {
      if (!apiKey) throw new Error();
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      const history = messages.map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(`[Respond in ${language}]\n${text}`);
      const aiMsg = { id: Date.now() + 1, role: 'model', text: result.response.text() };
      setMessages(prev => [...prev, aiMsg]);
      try { push(chatRef, aiMsg); } catch (e) {}
    } catch (error) {
      const mockText = getMockResponse(text);
      const fallbackMsg = { id: Date.now() + 1, role: 'model', text: mockText };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onresult = (e) => handleSend(e.results[0][0].transcript);
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

  if (authLoading) return <LoadingScreen />;
  if (!user) return <Login />;

  return (
    <Router>
      <div className="app-shell">
        <Sidebar user={user} language={language} setLanguage={setLanguage} setShowSettings={setShowSettings} />
        <main className="app-main" role="main">
          <Routes>
            <Route path="/" element={<Dashboard dailyFact={dailyFact} />} />
            <Route path="/assistant" element={
              <Assistant apiKey={apiKey} modelName={modelName} language={language} handleSend={handleSend} messages={messages} setMessages={setMessages} isLoading={isLoading} isListening={isListening} toggleListening={toggleListening} />
            } />
            <Route path="/practice" element={<Practice />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <AnimatePresence>
          {showSettings && <ConfigModal apiKey={apiKey} modelName={modelName} setModelName={setModelName} handleSaveApiKey={handleSaveApiKey} setShowSettings={setShowSettings} />}
        </AnimatePresence>
      </div>
    </Router>
  );
}
