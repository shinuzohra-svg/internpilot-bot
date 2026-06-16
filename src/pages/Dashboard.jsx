import { Briefcase, Target, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>
          Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track your HR and People Operations internship hunt in Delhi and Remote.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem' 
      }}>
        <StatCard icon={<Target color="#3b82f6" />} title="Target Roles" value="HR Intern" subtitle="People Ops, TA" />
        <StatCard icon={<Briefcase color="#8b5cf6" />} title="Applications" value="0" subtitle="Active pipeline" />
        <StatCard icon={<Clock color="#f59e0b" />} title="Interviews" value="0" subtitle="Upcoming" />
        <StatCard icon={<CheckCircle color="#10b981" />} title="Offers" value="0" subtitle="Accepted" />
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem' }}>
          Recent Activity
        </h2>
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
          <p>No recent activity. Start by finding internships!</p>
          <button className="btn-primary" style={{ marginTop: '1rem' }}>
            Find Internships
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{title}</h3>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '0.5rem', 
          borderRadius: '8px' 
        }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{subtitle}</div>
      </div>
    </div>
  );
}
