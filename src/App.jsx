import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { 
  Send, Bot, User, Menu, X, Settings, PlusCircle, 
  MessageSquare, FileText, MapPin, CheckSquare, Key,
  Mic, MicOff, Info, Globe, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VoterChecklist from './components/VoterChecklist';
import BallotSimulator from './components/BallotSimulator';
import './App.css';

const SYSTEM_INSTRUCTION = `You are CivicAI, a smart, dynamic assistant dedicated to election process education. 
Your goal is to guide users (like first-time voters, general citizens) through the election process neutrally and objectively.
Help them understand voter registration, polling station procedures, ballot understanding, and counting mechanics.
Always provide clear, accessible, and factual information. Avoid political bias, endorsing candidates, or discussing political opinions. 
Focus strictly on the *process* of elections, voting rights, and civic duties.
Use clear formatting, bullet points, and concise explanations.`;

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [dailyFact, setDailyFact] = useState('');
  const [language, setLanguage] = useState('English');
  const [showSimulator, setShowSimulator] = useState(false);
  
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const savedKey = localStorage.getItem('gemini_api_key');
    
    let activeKey = '';
    if (envKey) {
      activeKey = envKey;
      setApiKey(envKey);
    } else if (savedKey) {
      activeKey = savedKey;
      setApiKey(savedKey);
    } else {
      setShowSettings(true);
    }

    if (activeKey) {
      fetchDailyFact(activeKey);
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const fetchDailyFact = async (key) => {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = "Provide one short, fascinating, and neutral fact about the election process or voting history. Keep it under 100 characters.";
      const result = await model.generateContent(prompt);
      setDailyFact(result.response.text());
    } catch (e) {
      console.error("Fact fetch failed", e);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setShowSettings(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    const newUserMessage = { id: Date.now(), role: 'user', text };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: {
          role: 'system',
          parts: [{ text: `${SYSTEM_INSTRUCTION}\nIMPORTANT: Please respond strictly in ${language}.` }],
        }
      });

      // Prepare chat history
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(text);
      const responseText = result.response.text();

      const newAiMessage = { id: Date.now() + 1, role: 'model', text: responseText };
      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = { 
        id: Date.now() + 1, 
        role: 'model', 
        text: `**Error:** I couldn't process that request. Please check your API key and try again.\n\n*Details: ${error.message}*` 
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      if (error.message.includes('API key')) {
        setShowSettings(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { icon: <FileText size={18} />, text: "How do I register to vote?" },
    { icon: <MapPin size={18} />, text: "How do I find my polling station?" },
    { icon: <CheckSquare size={18} />, text: "What ID do I need on election day?" },
    { icon: <MessageSquare size={18} />, text: "Explain the ballot counting process." },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon">
            <Bot size={24} />
          </div>
          <span className="sidebar-title">CivicAI</span>
          <button className="menu-btn" aria-label="Close menu" onClick={() => setSidebarOpen(false)} style={{marginLeft: 'auto'}}>
            <X size={24} />
          </button>
        </div>
        
        <div className="sidebar-content">
          <button className="new-chat-btn" onClick={startNewChat}>
            <PlusCircle size={20} />
            New Conversation
          </button>
          
          <h3 className="sidebar-section-title">Quick Topics</h3>
          <div className="quick-prompts">
            {quickPrompts.map((prompt, index) => (
              <button 
                key={index} 
                className="prompt-btn"
                onClick={() => {
                  handleSend(prompt.text);
                  setSidebarOpen(false);
                }}
              >
                {prompt.icon}
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>

          <h3 className="sidebar-section-title" style={{marginTop: '1.5rem'}}>Interactive Learning</h3>
          <button className="prompt-btn" onClick={() => { setShowSimulator(true); setSidebarOpen(false); }}>
            <Play size={18} />
            <span>Ballot Simulator</span>
          </button>
          
          <VoterChecklist />
        </div>

        <div className="sidebar-footer">
          <div className="lang-selector">
            <Globe size={18} />
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="English">English</option>
              <option value="Spanish">Español</option>
              <option value="Hindi">हिन्दी</option>
              <option value="French">Français</option>
              <option value="Arabic">العربية</option>
            </select>
          </div>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>
            <Settings size={20} />
            <span>API Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <button className="menu-btn" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          {!sidebarOpen && <span className="sidebar-title" style={{ display: 'none' }} >CivicAI</span>}
        </header>

        <div className="chat-container" ref={chatContainerRef}>
          {messages.length === 0 ? (
            <div className="welcome-screen fade-in">
              <div className="welcome-icon">
                <Bot size={48} />
              </div>
              <h1 className="welcome-title">Welcome to CivicAI</h1>
              {dailyFact && (
                <div className="daily-fact fade-in">
                  <Info size={16} />
                  <span><strong>Fact of the Day:</strong> {dailyFact}</span>
                </div>
              )}
              <p className="welcome-subtitle">
                Your smart, unbiased guide to understanding the election process, voter rights, and civic duties.
              </p>
              
              <div className="feature-grid">
                <div className="feature-card">
                  <FileText className="feature-icon" size={32} />
                  <h3 className="feature-title">Voter Registration</h3>
                  <p className="feature-desc">Learn how to register, check your status, and update your information securely.</p>
                </div>
                <div className="feature-card">
                  <MapPin className="feature-icon" size={32} />
                  <h3 className="feature-title">Polling Stations</h3>
                  <p className="feature-desc">Understand how polling locations are assigned and what to expect when you arrive.</p>
                </div>
                <div className="feature-card">
                  <CheckSquare className="feature-icon" size={32} />
                  <h3 className="feature-title">The Ballot</h3>
                  <p className="feature-desc">Discover how to read and fill out your ballot correctly to ensure your vote counts.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-wrapper fade-in ${msg.role === 'model' ? 'ai' : ''}`}>
                  <div className="message-content">
                    <div className={`avatar ${msg.role === 'model' ? 'ai' : 'user'}`}>
                      {msg.role === 'model' ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    <div className="message-body markdown-body">
                      {msg.role === 'model' ? (
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message-wrapper ai fade-in">
                  <div className="message-content">
                    <div className="avatar ai">
                      <Bot size={20} />
                    </div>
                    <div className="message-body">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="input-area">
          <div className="input-container">
            <textarea
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about the election process..."
              rows={1}
            />
            <button 
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              onClick={toggleListening}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              className="send-btn" 
              aria-label="Send message"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <span className="loader"></span> : <Send size={20} />}
            </button>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                <Key size={24} color="var(--primary)" />
                Configuration
              </h2>
              {apiKey && (
                <button className="close-btn" aria-label="Close settings" onClick={() => setShowSettings(false)}>
                  <X size={24} />
                </button>
              )}
            </div>
            
            <div className="form-group">
              <label className="form-label">Google Gemini API Key</label>
              <input
                type="password"
                className="form-input"
                placeholder="AIzaSy..."
                defaultValue={apiKey}
                id="api-key-input"
              />
              <p className="form-text">
                To use CivicAI, you need a free Gemini API key. 
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{marginLeft: '4px'}}>
                  Get one here.
                </a>
              </p>
            </div>
            
            <button 
              className="btn-primary"
              onClick={() => {
                const key = document.getElementById('api-key-input').value;
                if (key.trim()) handleSaveApiKey(key.trim());
              }}
            >
              Save & Continue
            </button>
          </motion.div>
        </div>
      )}

      {/* Ballot Simulator Modal */}
      <AnimatePresence>
        {showSimulator && (
          <BallotSimulator onClose={() => setShowSimulator(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
