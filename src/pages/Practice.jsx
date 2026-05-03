import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ClipboardCheck, Award, HelpCircle, CheckCircle } from 'lucide-react';
import BallotSimulator from '../components/BallotSimulator';
import './Practice.css';

export default function Practice() {
  const [showSimulator, setShowSimulator] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const modules = [
    { 
      id: 'ballot', 
      title: 'Ballot Simulator', 
      desc: 'Practice marking a digital ballot and avoid common mistakes like over-voting.',
      icon: <ClipboardCheck size={24} />,
      btn: 'Start Simulation',
      action: () => setShowSimulator(true)
    },
    { 
      id: 'quiz', 
      title: 'Civic Knowledge Quiz', 
      desc: 'Test your knowledge on voting rights, registration laws, and government structure.',
      icon: <HelpCircle size={24} />,
      btn: 'Take Quiz',
      action: () => alert('Civic Quiz coming soon!')
    },
  ];

  return (
    <div className="practice-page">
      <header className="page-header">
        <h1>Practice Center</h1>
        <p>Build your confidence and knowledge before you head to the polls.</p>
      </header>

      <div className="module-grid">
        {modules.map((m, i) => (
          <motion.div 
            key={m.id}
            className="module-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="module-icon">{m.icon}</div>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
            <button className="btn-module" onClick={m.action}>
              <Play size={16} /> {m.btn}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="practice-stats">
        <div className="stat-item">
          <Award size={32} color="var(--primary-light)" />
          <div>
            <span className="val">2/5</span>
            <span className="lab">Modules Completed</span>
          </div>
        </div>
        <div className="stat-item">
          <CheckCircle size={32} color="var(--accent)" />
          <div>
            <span className="val">85%</span>
            <span className="lab">Average Quiz Score</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSimulator && (
          <BallotSimulator onClose={() => setShowSimulator(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
