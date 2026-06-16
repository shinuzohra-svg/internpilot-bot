import { useState, useEffect } from 'react';
import { Terminal, Play, Square, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Poll the backend daemon logs every 3 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/daemon/logs');
        const data = await res.json();
        if (data.success) {
          setIsRunning(data.isRunning);
          setLogs(data.logs);
        }
      } catch (e) {
        // Backend offline
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleDaemon = async () => {
    try {
      const endpoint = isRunning ? 'stop' : 'start';
      const res = await fetch(`/api/daemon/${endpoint}`);
      const data = await res.json();
      if (data.success) {
        toast.success(`Daemon ${isRunning ? 'stopped' : 'started'}`);
        setIsRunning(!isRunning);
      }
    } catch (e) {
      toast.error('Failed to communicate with Daemon.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Activity color="var(--accent-color)" /> Autonomous Agent Command Center
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your elite profile is loaded. The background daemon will automatically find jobs, tailor your Big-4 style resume, and apply without any input.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', 
            background: isRunning ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isRunning ? '0 0 40px rgba(16, 185, 129, 0.4)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <Terminal size={40} color={isRunning ? 'var(--success-color)' : '#ef4444'} />
          </div>
          
          <div>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              System Status: {isRunning ? 'Active & Hunting' : 'Sleeping'}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isRunning ? 'The agent is currently scanning databases and auto-applying to relevant HR internships in the background.' : 'The agent is offline. Click Start to begin autonomous applications.'}
            </p>
          </div>

          <button 
            onClick={toggleDaemon}
            style={{ 
              background: isRunning ? 'rgba(239, 68, 68, 0.2)' : 'var(--accent-color)',
              color: isRunning ? '#ef4444' : 'white',
              border: isRunning ? '1px solid #ef4444' : 'none',
              padding: '1rem 3rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isRunning ? <Square fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />}
            {isRunning ? 'STOP DAEMON' : 'START DAEMON'}
          </button>
        </div>

        <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color="var(--accent-color)" /> Risk Management
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              To prevent bot-bans from LinkedIn/Indeed and rate limits from OpenRouter AI, the daemon is throttled to process 1 application every 2 minutes.
            </p>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="var(--success-color)" /> Active Persona
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
              <strong style={{ color: 'white', display: 'block', marginBottom: '0.25rem' }}>Human Capital Consultant</strong>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Big-4 Strategy Tier</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={18} /> Live Bot Terminal
        </h3>
        <div style={{ 
          flex: 1, background: '#0f172a', borderRadius: '8px', padding: '1rem', 
          fontFamily: 'monospace', overflowY: 'auto', border: '1px solid #1e293b'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: '#64748b' }}>Awaiting logs... Start the daemon to see output.</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} style={{ color: '#10b981', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
