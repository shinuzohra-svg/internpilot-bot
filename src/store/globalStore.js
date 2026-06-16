import { create } from 'zustand';

const initialProfile = {
  name: 'Md Ziyan Ansari',
  title: 'HR & People Operations Professional',
  summary: 'Detail-oriented Human Resources professional with practical experience in full-cycle recruitment, candidate engagement, and organizational operations. Adept at leveraging ATS workflows and data-driven sourcing strategies to streamline hiring pipelines and enhance candidate experience. Proven ability to coordinate large-scale talent initiatives and drive cross-functional collaboration.',
  contact: {
    email: 'ansariziyan456@gmail.com',
    phone: '+91 97700 29011',
    location: 'New Delhi, India',
    linkedin: 'linkedin.com/in/md-ziyan-ansari-607950327',
    portfolio: 'ziyan.dev'
  },
  skills: [
    'Full-Cycle Recruitment', 'Candidate Sourcing & Screening', 'ATS Management',
    'Stakeholder Communication', 'Onboarding & Operations', 'Event & Logistics Coordination', 
    'HR Data Management', 'Workflow Optimization'
  ],
  experience: [
    {
      id: '1',
      role: 'Human Resource Intern',
      company: 'Shine Projects India',
      date: 'Jul 2023 - Sep 2023',
      bullets: [
        'Executed end-to-end talent sourcing strategies across multiple job portals, increasing quality applicant pipeline for entry-level roles.',
        'Conducted structured pre-screening assessments to evaluate technical fit and core competencies, significantly reducing hiring manager interview time.',
        'Maintained rigorous candidate data integrity within tracking systems and orchestrated complex interview schedules for cross-functional teams.'
      ]
    },
    {
      id: '2',
      role: 'Human Resource Team Member',
      company: 'The Marketing Society, JMI',
      date: 'Jan 2023 - Present',
      bullets: [
        'Spearheaded internal communications and member onboarding frameworks, ensuring rapid integration of 30+ new members into organizational workflows.',
        'Partnered with executive leadership to streamline operational processes during high-impact workshops and campus recruitment drives.'
      ]
    },
    {
      id: '3',
      role: 'Event & Logistics Team Member',
      company: 'Entrepreneurship Cell, JMI',
      date: 'Jan 2023 - Present',
      bullets: [
        'Directed end-to-end logistics and stakeholder management for high-profile seminars and entrepreneurship summits.',
        'Optimized registration workflows and speaker coordination to deliver seamless event execution for 500+ attendees.'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Business Administration (BBA)',
      institution: 'Jamia Millia Islamia',
      date: 'Aug 2025 - May 2029',
      details: 'Focus on strategic management, organizational behavior, and corporate operations.'
    },
    {
      id: '2',
      degree: 'Class XII – Commerce',
      institution: 'New Era Progressive School',
      date: 'Apr 2024 - May 2025',
      details: 'Core subjects: Business Studies, Economics, Accountancy.'
    }
  ]
};

export const useGlobalStore = create((set) => ({
  userProfile: initialProfile,
  
  targetJob: null,
  
  setTargetJob: (job) => set({ targetJob: job }),
  
  updateProfile: (newData) => set((state) => ({ 
    userProfile: { ...state.userProfile, ...newData } 
  }))
}));
