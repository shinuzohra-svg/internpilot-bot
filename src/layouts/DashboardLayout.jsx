import { Outlet, NavLink } from 'react-router-dom';
import { Briefcase, FileText, LayoutTemplate as Kanban, LayoutDashboard, Settings } from 'lucide-react';

export default function DashboardLayout() {
  return (
    <>
      <aside style={{
        width: '260px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
            width: '32px', height: '32px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold'
          }}>
            IP
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>InternPilot</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/jobs" icon={<Briefcase size={20} />} label="Find Internships" />
          <NavItem to="/resume" icon={<FileText size={20} />} label="Resume Tailor" />
          <NavItem to="/tracker" icon={<Kanban size={20} />} label="Application Tracker" />
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      <main className="main-content">
        <header className="glass-panel" style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          borderRadius: '0',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          zIndex: 5
        }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Welcome back, Md Ziyan Ansari
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>MZ</span>
            </div>
          </div>
        </header>

        <div className="page-container animate-fade-in">
          <Outlet />
        </div>
      </main>
    </>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        color: isActive ? 'white' : 'var(--text-secondary)',
        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
        border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
        transition: 'all 0.2s ease',
        fontWeight: isActive ? 500 : 400
      })}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
