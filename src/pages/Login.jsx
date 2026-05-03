import { useState } from 'react';
import { 
  auth 
} from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously
} from 'firebase/auth';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, ShieldCheck, Mail, Lock, Zap } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (err) {
      setError("Demo access failed. Please try email login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="login-header">
            <div className="logo-icon large">C</div>
            <h1>CivicAI</h1>
            <p>{isLogin ? 'Welcome back to your civic journey' : 'Start your civic journey today'}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-alert">{error}</div>}
            
            <div className="input-group">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button className="btn-primary login-submit" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="btn-demo" onClick={handleDemoAccess} disabled={loading}>
            <Zap size={18} />
            Instant Demo Access
          </button>

          <div className="login-footer">
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </motion.div>
        
        <div className="login-info">
          <div className="info-item">
            <ShieldCheck size={24} />
            <div>
              <h3>Secure & Private</h3>
              <p>Your civic data and chat history are protected with Firebase security.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
