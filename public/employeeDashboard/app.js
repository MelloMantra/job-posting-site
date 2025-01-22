document.addEventListener('DOMContentLoaded', async () => {

    //get 4 jobs
    try {
        const jobs = await fetch('../api/user/get4Jobs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (jobs.ok) {
            const jobsJson = await jobs.json();

            /* 
            Jobs are returned in the following format:
            jobs:
            [
                {
                    "id": 1, (to set an href = `/job/${job.id}` and `/allApps/${job.id}`)
                    "title": "Software Engineer",
                    "address": "123 Main St, City, AB",
                    "applicantCount": 5,
                    "isRemote": true,
                    "status": "open", (open, decided, closed)
                    "hours": "Full Time", (Full Time, Part Time, Seasonal, Internship)
                    "estimatedPay": 10000,
                    "jobDescription": "We are looking for a talented software engineer to join our team.",
                }
            ]
            */
        } else {
            console.log(`Error: ${jobs.status} ${jobs.statusText}`);
            alert("Internal server error.");
        }
    } catch (err) {
        console.error('Error querying database:', err);
        alert('An unexpected error occurred. Please try again.');
    }

    //get 4 applications
    try {
        const applications = await fetch('../api/user/get4Applications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (applications.ok) {
            const applicationsJson = await applications.json().applications;

            /* 
            Applications are returned in the following format:
            applications:
            [
                {
                    "job": 1, (to set an href = `/job/${job.id}`)
                    "jobTitle": "Software Engineer",
                    "jobAddress": "123 Main St, City, AB",
                    "state": "pending", (pending, accepted, rejected)
                    "created_at": "2023-01-01T00:00:00.000Z" //you may want to format das ting, use the formatdate function
                    "companyName": "Company Name"
                }
            ]
            */
        } else {
            console.log(`Error: ${applications.status} ${applications.statusText}`);
            alert("Internal server error.");
        }
    } catch (err) {
        console.error('Error querying database:', err);
        alert('An unexpected error occurred. Please try again.');
    }

});