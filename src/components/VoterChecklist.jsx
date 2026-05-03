import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Circle } from 'lucide-react';
import './VoterChecklist.css';

const CHECKLIST_ITEMS = [
  { id: 'register', text: 'Register to vote' },
  { id: 'research', text: 'Research the candidates & issues' },
  { id: 'plan', text: 'Make a plan to vote (When & Where)' },
  { id: 'id', text: 'Check required ID for polling station' },
  { id: 'vote', text: 'Cast your ballot!' },
];

export default function VoterChecklist() {
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('voter_checklist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('voter_checklist', JSON.stringify(completed));
    if (completed.length === CHECKLIST_ITEMS.length) {
      triggerConfetti();
    }
  }, [completed]);

  const toggleItem = (id) => {
    setCompleted(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#a855f7', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#a855f7', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const progress = (completed.length / CHECKLIST_ITEMS.length) * 100;

  return (
    <div className="checklist-container fade-in">
      <h3 className="checklist-title">Your Voter Journey</h3>
      
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="progress-text">{Math.round(progress)}% Civic Readiness</p>

      <ul className="checklist">
        {CHECKLIST_ITEMS.map((item) => {
          const isDone = completed.includes(item.id);
          return (
            <li 
              key={item.id} 
              className={`checklist-item ${isDone ? 'done' : ''}`}
              onClick={() => toggleItem(item.id)}
            >
              {isDone ? (
                <CheckCircle2 className="check-icon done" size={20} />
              ) : (
                <Circle className="check-icon" size={20} />
              )}
              <span className="item-text">{item.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
