import { useState, useEffect } from 'react';
import { useGlobalStore } from '../../../store/globalStore';
import { tailorResume } from '../services/aiService';
import toast from 'react-hot-toast';
import { FileText, Wand2, Download, Settings, Edit3, ExternalLink } from 'lucide-react';

export default function ResumePage() {
  const profile = useGlobalStore(state => state.userProfile);
  const targetJob = useGlobalStore(state => state.targetJob);
  const updateProfile = useGlobalStore(state => state.updateProfile);
  const [activeTab, setActiveTab] = useState('editor');
  const [jdText, setJdText] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);

  useEffect(() => {
    if (targetJob) {
      setActiveTab('tailor');
      setJdText(`${targetJob.title} at ${targetJob.company}\n\n${targetJob.description}`);
    }
  }, [targetJob]);

  const handleTailor = async () => {
    if (!jdText.trim()) {
      toast.error('Please paste a Job Description first.');
      return;
    }

    let apiKey = localStorage.getItem('openRouterApiKey');
    if (!apiKey) {
      apiKey = window.prompt('Please enter your OpenRouter API Key (Free Tier):\n\nYou can get one at https://openrouter.ai/keys');
      if (apiKey) {
        localStorage.setItem('openRouterApiKey', apiKey);
      } else {
        toast.error('API Key is required to use AI.');
        return;
      }
    }

    setIsTailoring(true);
    const loadingToast = toast.loading('AI is analyzing and rewriting your resume...');
    
    try {
      const tailoredExp = await tailorResume(profile, jdText, apiKey);
      updateProfile({ experience: tailoredExp });
      toast.success('Resume successfully tailored!', { id: loadingToast });
      setActiveTab('editor'); // Switch back to view changes
    } catch (error) {
      console.error(error);
      toast.error('Failed to tailor resume. Check console or API key.', { id: loadingToast });
    } finally {
      setIsTailoring(false);
    }
  };

  const handleAutoApply = async () => {
    if (!targetJob || !targetJob.applyUrl) {
      toast.error('No application URL available for this job.');
      return;
    }

    const confirm = window.confirm('Are you sure you want to let the AI Bot automatically navigate to this job board and apply on your behalf?');
    if (!confirm) return;

    setIsTailoring(true);
    const applyToast = toast.loading('Initializing headless browser and attempting to apply...');

    try {
      const response = await fetch('http://localhost:5000/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applyUrl: targetJob.applyUrl, profile })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(result.message, { id: applyToast, duration: 5000 });
      } else {
        toast.error(result.error, { id: applyToast, duration: 5000 });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to communicate with auto-applier bot.', { id: applyToast });
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>
            Resume Tailor
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your master resume and use AI to tailor it for specific jobs.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={() => setActiveTab('editor')}>
            <Edit3 size={18} /> Master Resume
          </button>
          <button className="btn-primary" onClick={() => setActiveTab('tailor')}>
            <Wand2 size={18} /> AI Tailor
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' }}>
        
        {/* Editor / Configuration Pane */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ color: 'white', fontWeight: 500 }}>
              {activeTab === 'editor' ? 'Master Profile Data' : 'AI Tailoring Settings'}
            </h3>
            {activeTab === 'tailor' && <Settings size={18} color="var(--text-secondary)" />}
          </div>
          
          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
            {activeTab === 'editor' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Section title="Basic Info">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input label="Full Name" value={profile.name} />
                    <Input label="Target Title" value={profile.title} />
                    <Input label="Email" value={profile.contact?.email || ''} />
                    <Input label="Phone" value={profile.contact?.phone || ''} />
                  </div>
                </Section>
                
                <Section title="Summary">
                  <textarea 
                    value={profile.summary}
                    readOnly
                    style={{ width: '100%', height: '100px', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', resize: 'none' }}
                  />
                </Section>
                
                <Section title="Experience">
                  {profile.experience.map(exp => (
                    <div key={exp.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                      <div style={{ fontWeight: 600, color: 'white' }}>{exp.role}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{exp.company} • {exp.date}</div>
                      <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {exp.bullets.map((b, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </Section>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Wand2 size={16} /> Target Job Description
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Review the JD below. Our AI will analyze it and rewrite your resume bullets to highlight the most relevant skills.
                  </p>
                  <textarea 
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the target job description here..."
                    style={{ width: '100%', height: '150px', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', resize: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      className="btn-primary" 
                      style={{ flex: 1, opacity: isTailoring ? 0.7 : 1 }}
                      onClick={handleTailor}
                      disabled={isTailoring}
                    >
                      {isTailoring ? 'Tailoring...' : 'Tailor Resume Automatically'}
                    </button>
                    {targetJob && targetJob.applyUrl && (
                      <>
                        <button 
                          className="btn-primary" 
                          style={{ background: '#8b5cf6', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          onClick={handleAutoApply}
                          disabled={isTailoring}
                        >
                          🤖 One-Click Auto-Apply
                        </button>
                        <a href={targetJob.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ background: 'var(--success-color)', color: 'white', border: 'none' }}>
                          <ExternalLink size={16} /> Go to Application
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Pane */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'white', fontWeight: 500 }}>Live Preview</h3>
            <button className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
              <Download size={14} /> Export PDF
            </button>
          </div>
          
          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: '#e2e8f0' }}>
            {/* The actual A4 Resume Sheet */}
            <div style={{ 
              background: 'white', 
              color: 'black', 
              padding: '2.5rem', 
              borderRadius: '4px',
              minHeight: '842px', // A4 aspect ratio approximation
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              fontFamily: 'Arial, sans-serif'
            }}>
              <header style={{ borderBottom: '2px solid #2563eb', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>{profile.name}</h1>
                <h2 style={{ fontSize: '1.1rem', color: '#3b82f6', margin: '0.25rem 0 0.5rem 0' }}>{profile.title}</h2>
                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '1rem' }}>
                  <span>{profile.contact?.location}</span>
                  <span>{profile.contact?.phone}</span>
                  <span>{profile.contact?.email}</span>
                </div>
              </header>
              
              <section style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Summary</h3>
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>{profile.summary}</p>
              </section>

              <section style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Experience</h3>
                {profile.experience.map(exp => (
                  <div key={exp.id} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>{exp.role}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{exp.date}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#3b82f6', marginBottom: '0.25rem', fontWeight: 500 }}>{exp.company}</div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#334155' }}>
                      {exp.bullets.map((b, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </section>
              
              <section style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Education</h3>
                {profile.education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>{edu.degree}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{edu.date}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>{edu.institution}, {edu.location}</div>
                  </div>
                ))}
              </section>

              <section>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Skills</h3>
                <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                  {profile.skills.join(' • ')}
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function Input({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</label>
      <input 
        type="text" 
        value={value} 
        readOnly
        style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white', outline: 'none' }}
      />
    </div>
  );
}
