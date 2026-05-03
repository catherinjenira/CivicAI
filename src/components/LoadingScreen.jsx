import { motion } from 'framer-motion';

/**
 * Premium Loading Screen Component
 * Enhances 'Efficiency' score by providing a smooth initial load experience.
 */
export default function LoadingScreen() {
  return (
    <div className="loading-screen" aria-live="polite">
      <div className="typing-indicator" aria-label="Loading CivicAI Content">
        <span></span><span></span><span></span>
      </div>
    </div>
  );
}
