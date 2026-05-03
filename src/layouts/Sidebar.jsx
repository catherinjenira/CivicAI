import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, BookOpen, 
  Gamepad2, Settings, Globe, LogOut, User 
} from 'lucide-react';
import { auth } from '../firebase';
import VoterChecklist from '../components/VoterChecklist';
import './Sidebar.css';

export default function Sidebar({ user, language, setLanguage, setShowSettings }) {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      auth.signOut();
    }
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">C</div>
          <span>CivicAI</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/assistant" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <MessageSquare size={20} />
          <span>AI Assistant</span>
        </NavLink>
        <NavLink to="/practice" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Gamepad2 size={20} />
          <span>Practice Center</span>
        </NavLink>
        <NavLink to="/resources" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <BookOpen size={20} />
          <span>Resource Hub</span>
        </NavLink>
      </nav>

      <div className="sidebar-divider"></div>

      <div className="sidebar-content">
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
          </select>
        </div>
        <button className="settings-btn" onClick={() => setShowSettings(true)}>
          <Settings size={20} />
          <span>API Settings</span>
        </button>
        
        <div className="user-profile">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">{user.isAnonymous ? 'Demo User' : user.email.split('@')[0]}</span>
            <span className="user-status">Online</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
