// Mock data and API functions for Job Discovery

export const searchJobs = async ({ query = 'HR Intern OR Human Resources Internship', location = 'New Delhi, India', count = 30 }) => {
  try {
    const url = new URL('http://localhost:5000/api/jobs');
    url.searchParams.append('query', query);
    url.searchParams.append('location', location);
    url.searchParams.append('count', count);

    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch jobs from backend:', result.error);
      return [];
    }
  } catch (error) {
    console.error('Error connecting to JobSpy backend:', error);
    // Return empty if backend is offline
    return [];
  }
};
