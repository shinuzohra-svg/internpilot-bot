import { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrackerPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchApplications();
      }
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const columns = [
    { id: 'Applied', title: 'Auto-Applied', icon: <CheckCircle2 size={18} color="#10b981" /> },
    { id: 'Interviewing', title: 'Interviewing', icon: <Clock size={18} color="#f59e0b" /> },
    { id: 'Rejected', title: 'Rejected', icon: <XCircle size={18} color="#ef4444" /> },
    { id: 'Offer', title: 'Offer Received!', icon: <AlertCircle size={18} color="#8b5cf6" /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Activity color="var(--accent-color)" /> Application Tracker
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Monitor all internships your bot has applied to. Move cards as you progress through interviews!
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflowX: 'auto', paddingBottom: '1rem' }}>
        {columns.map(col => (
          <div key={col.id} className="glass-panel" style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1rem' }}>
            <h3 style={{ color: 'white', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
              {col.icon} {col.title}
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                {applications.filter(a => a.status === col.id).length}
              </span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
              {loading && applications.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>Loading...</div>
              ) : applications.filter(a => a.status === col.id).length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>No applications here</div>
              ) : (
                applications.filter(a => a.status === col.id).map(app => (
                  <div key={app.id} className="glass-card animate-slide-up" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '1.05rem', marginBottom: '0.25rem', fontWeight: 600 }}>{app.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{app.company}</p>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                      
                      <select 
                        value={app.status} 
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        style={{ 
                          background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '4px', padding: '0.25rem', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' 
                        }}
                      >
                        {columns.map(c => <option key={c.id} value={c.id} style={{ background: '#0f172a' }}>{c.title}</option>)}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
