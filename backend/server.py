from flask import Flask, jsonify, request
from flask_cors import CORS
from jobspy import scrape_jobs
import traceback

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        # Get query parameters with defaults for HR in Delhi/India
        search_term = request.args.get('query', 'HR Intern OR Human Resources Internship')
        location = request.args.get('location', 'New Delhi, India')
        results_wanted = int(request.args.get('count', 30))

        # We use JobSpy to scrape multiple boards
        jobs_df = scrape_jobs(
            site_name=["indeed", "linkedin", "glassdoor"],
            search_term=search_term,
            location=location,
            results_wanted=results_wanted,
            hours_old=72, # jobs from the last 3 days
            country_eka="india"
        )
        
        # JobSpy returns a pandas DataFrame. Convert to dictionary.
        # We need to map JobSpy's output to our frontend format.
        # JobSpy columns: id, title, company, job_url, location, description, job_type, date_posted...
        
        jobs_list = []
        
        if jobs_df is not None and not jobs_df.empty:
            # Handle NaNs
            jobs_df = jobs_df.fillna('')
            
            for index, row in jobs_df.iterrows():
                # Format to match our frontend UI
                jobs_list.append({
                    "id": str(row.get('id', index)),
                    "title": row.get('title', 'Unknown Title'),
                    "company": row.get('company', 'Unknown Company'),
                    "location": row.get('location', location),
                    "salary": row.get('salary_source', 'Salary not provided'),
                    "postedDate": str(row.get('date_posted', 'Recent')),
                    "type": row.get('job_type', 'Internship'),
                    "matchScore": 85, # We'll mock this or calculate on frontend
                    "logo": str(row.get('company', 'C'))[0].upper(),
                    "tags": [str(row.get('site', 'web'))],
                    "description": str(row.get('description', 'No description available'))[:300] + '...',
                    "applyUrl": row.get('job_url', '')
                })
                
        return jsonify({"success": True, "data": jobs_list})
        
    except Exception as e:
        print(f"Error scraping jobs: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e), "data": []})

if __name__ == '__main__':
    print("🚀 Starting InternPilot JobSpy Engine on port 5000...")
    app.run(port=5000, debug=True)
