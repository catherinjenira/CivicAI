import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, HelpCircle, X } from 'lucide-react';
import './BallotSimulator.css';

export default function BallotSimulator({ onClose }) {
  const [selections, setSelections] = useState({});
  const [showTutorial, setShowTutorial] = useState(true);

  const candidates = [
    { id: 1, name: 'Candidate A', party: 'Independent' },
    { id: 2, name: 'Candidate B', party: 'Civic Party' },
    { id: 3, name: 'Candidate C', party: 'Liberty Group' },
  ];

  const handleSelect = (id) => {
    setSelections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isInvalid = Object.values(selections).filter(Boolean).length > 1;

  return (
    <motion.div 
      className="simulator-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="simulator-modal"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div className="simulator-header">
          <h2>Practice Ballot Simulator</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="simulator-body">
          <AnimatePresence>
            {showTutorial && (
              <motion.div 
                className="tutorial-box"
                exit={{ opacity: 0, height: 0 }}
              >
                <HelpCircle className="tutorial-icon" size={24} />
                <div>
                  <p><strong>How to use:</strong> Practice filling out a digital ballot. Remember, in most elections, you can only pick ONE candidate per office.</p>
                  <button onClick={() => setShowTutorial(false)}>Got it!</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="ballot-card">
            <div className="ballot-title">OFFICIAL SAMPLE BALLOT</div>
            <div className="ballot-instructions">Select ONE candidate for the office of <strong>Civic Representative</strong>:</div>

            <div className="candidate-list">
              {candidates.map(c => (
                <div 
                  key={c.id} 
                  className={`candidate-row ${selections[c.id] ? 'selected' : ''}`}
                  onClick={() => handleSelect(c.id)}
                >
                  <div className="selection-box">
                    {selections[c.id] && <Check size={16} />}
                  </div>
                  <div className="candidate-info">
                    <div className="name">{c.name}</div>
                    <div className="party">{c.party}</div>
                  </div>
                </div>
              ))}
            </div>

            {isInvalid && (
              <div className="error-msg fade-in">
                <AlertCircle size={18} />
                <span><strong>Invalid Ballot:</strong> You have selected more than one candidate. In a real election, this is called "over-voting" and your vote for this office would not count.</span>
              </div>
            )}
          </div>
        </div>

        <div className="simulator-footer">
          <div className="status-indicator">
            Status: {isInvalid ? <span className="status-err">Invalid</span> : Object.values(selections).some(Boolean) ? <span className="status-ok">Valid</span> : 'Empty'}
          </div>
          <button className="btn-primary" disabled={isInvalid || !Object.values(selections).some(Boolean)} onClick={onClose}>
            Complete Practice
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
