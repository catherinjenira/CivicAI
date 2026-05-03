import { motion } from 'framer-motion';
import { 
  Users, Calendar, Vote, TrendingUp, 
  Info, ChevronRight, Award
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({ dailyFact }) {
  const stats = [
    { label: 'Registered Voters', value: '168.3M', change: '+2.4%', icon: <Users /> },
    { label: 'Days to Election', value: '184', change: 'Next: Nov 3', icon: <Calendar /> },
    { label: 'Civic Readiness', value: '85%', change: '+12%', icon: <Vote /> },
    { label: 'Platform Activity', value: '1.2M', change: 'Live', icon: <TrendingUp /> },
  ];

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Welcome to Civic Dashboard</h1>
        <p>Stay informed, stay engaged, and prepare for your next vote.</p>
      </header>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
            <div className="stat-change">{stat.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="content-main">
          <motion.div 
            className="daily-fact-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="card-header">
              <Info size={20} />
              <h3>Civic Fact of the Day</h3>
            </div>
            <p>{dailyFact || "Loading your daily civic insight..."}</p>
          </motion.div>

          <div className="quick-actions">
            <div className="action-card primary">
              <h3>Practice Voting</h3>
              <p>Try our Interactive Ballot Simulator to prepare for election day.</p>
              <button className="btn-action">Start Practice <ChevronRight size={16} /></button>
            </div>
            <div className="action-card secondary">
              <h3>Resource Hub</h3>
              <p>Explore over 100 articles and facts about our democracy.</p>
              <button className="btn-action">Explore <ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        <div className="content-sidebar">
          <div className="achievements-card">
            <h3><Award size={18} /> Your Progress</h3>
            <div className="achievement-list">
              <div className="achievement-item completed">
                <div className="dot"></div>
                <span>Registration Verified</span>
              </div>
              <div className="achievement-item">
                <div className="dot"></div>
                <span>Candidate Research</span>
              </div>
              <div className="achievement-item">
                <div className="dot"></div>
                <span>Polling Station Found</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
