import { motion } from 'framer-motion';
import { X, Key } from 'lucide-react';

/**
 * API Configuration Modal
 * Handles Gemini API and Model selection.
 */
export default function ConfigModal({ apiKey, modelName, setModelName, handleSaveApiKey, setShowSettings }) {
  return (
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
  );
}
