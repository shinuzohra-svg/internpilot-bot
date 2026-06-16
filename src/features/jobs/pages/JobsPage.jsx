import { useState, useEffect } from 'react';
import { Terminal, Play, Square, Activity, ShieldAlert, CheckCircle2, Mail, ExternalLink, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Poll the backend daemon logs
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

  useEffect(() => {
    // Fetch live job feed
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        if (data.success) setJobs(data.data);
      } catch (e) {
        console.error('Failed to fetch job feed');
      }
    };
    fetchJobs();
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

  const handleColdEmail = (job) => {
    const subject = encodeURIComponent(`Application for ${job.title} - Md Ziyan Ansari`);
    const body = encodeURIComponent(`Hi ${job.contactName},\n\nI noticed the ${job.title} position at ${job.company} and wanted to reach out directly. I have a strong background in HR and Operations and believe my skills align perfectly with what you are building.\n\nPlease find my resume at ziyan.dev.\n\nBest regards,\nMd Ziyan Ansari`);
    window.open(`mailto:${job.contactEmail}?subject=${subject}&body=${body}`, '_blank');
    toast.success('Drafting cold email...');
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      {/* LEFT PANE: DAEMON COMMAND CENTER */}
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity color="var(--accent-color)" /> Auto-Apply Daemon
          </h1>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: isRunning ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isRunning ? '0 0 30px rgba(16, 185, 129, 0.4)' : 'none'
          }}>
            <Terminal size={32} color={isRunning ? 'var(--success-color)' : '#ef4444'} />
          </div>
          
          <button 
            onClick={toggleDaemon}
            style={{ 
              background: isRunning ? 'rgba(239, 68, 68, 0.2)' : 'var(--accent-color)',
              color: isRunning ? '#ef4444' : 'white',
              border: isRunning ? '1px solid #ef4444' : 'none',
              padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', width: '100%', justifyContent: 'center'
            }}
          >
            {isRunning ? <Square fill="currentColor" size={18} /> : <Play fill="currentColor" size={18} />}
            {isRunning ? 'STOP DAEMON' : 'START DAEMON'}
          </button>
        </div>

        <div className="glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={16} /> Live Logs
          </h3>
          <div style={{ 
            flex: 1, background: '#0f172a', borderRadius: '8px', padding: '0.75rem', 
            fontFamily: 'monospace', overflowY: 'auto', border: '1px solid #1e293b'
          }}>
            {logs.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Awaiting logs...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} style={{ color: '#10b981', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANE: HYBRID AGGREGATOR */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Briefcase color="var(--accent-color)" /> Live Aggregator Feed
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Thousands of roles pulled from Internshala, LinkedIn, and Indeed. Click to apply manually or draft an instant Cold Email to the Hiring Manager.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
          {jobs.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Loading aggregated roles...
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', gap: '1rem' }}>
                    <span>🏢 {job.company}</span>
                    {job.source && <span>🌐 {job.source}</span>}
                  </p>
                  {job.contactName && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={14} color="#10b981" />
                      Hiring Manager Found: <strong>{job.contactName}</strong>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {job.contactEmail && (
                    <button
                      onClick={() => handleColdEmail(job)}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa',
                        border: '1px solid rgba(139, 92, 246, 0.3)', padding: '0.5rem 1rem',
                        borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'}
                      onMouseOut={e => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}
                    >
                      <Mail size={16} /> Cold Email
                    </button>
                  )}
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: 'var(--accent-color)', color: 'white',
                      border: 'none', padding: '0.5rem 1rem', textDecoration: 'none',
                      borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                  >
                    1-Click Apply <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
