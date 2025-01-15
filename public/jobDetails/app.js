/*document.addEventListener("DOMContentLoaded", async function () {
  var data;

  const jobId = window.location.pathname.split('/').pop();
  try {
    const response = await fetch(`../api/all/getJob/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (response.ok) {
      data = await response.json();
      console.log(data);
    } else {
      console.log(`Error: ${response.status} ${response.statusText}`);
      alert("Internal server error.");
    } 
  } catch (err) {
    console.error('Error querying database:', err);
  }

  //data is the details of the job, and you can use it to populate the page. The JSON for the job is as follows:

  /* {
     int "id": 1,
     varchar(255) "company": "Company Name",
     varchar(255) "title": "Job Title",
     varchar(255) "address": "Job Address",
     longtext "description": "Job Description",
     enum("Part Time", "Full Time", "Seasonal") "hours": "Job Hours",
     float "estimatedPay": "Job Estimated Pay", (per year)
     longtext "requiredExperience": "Job Required Experience",
     longtext "preferredExperience": "Job Preferred Experience",
     int "occupation": "Job Occupation", (the id of the occupation)
     int "industry": "Job Industry", (the id of the industry)
     date "date_created": "Job Date Created"
     boolean "isRemote": True
     enum("open", "decided", "closed") "status": "Job Status"
     varchar(255) "occupation_name": "Occupation Name",
     varchar(255) "industry_name": "Industry Name"
     } */
/*});*/

document.addEventListener("DOMContentLoaded", async function () {
    const jobId = window.location.pathname.split('/').pop();
    try {
        const response = await fetch(`../api/all/getJob/${jobId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // Populate the page with job data
            document.getElementById('companyName').textContent = data.jobs.company;
            document.getElementById('jobTitle').textContent = data.jobs.title;
            document.getElementById('jobStatus').textContent = data.jobs.status.charAt(0).toUpperCase() + data.jobs.status.slice(1);
            document.getElementById('jobStatus').className = `job-status status-${data.jobs.status}`;
            document.getElementById('jobDescription').textContent = data.jobs.description;
            document.getElementById('jobLocation').textContent = data.jobs.address;
            document.getElementById('jobHours').textContent = data.jobs.hours;
            document.getElementById('jobPay').textContent = `$${data.jobs.estimatedPay.toLocaleString()} per year`;
            document.getElementById('jobIndustry').textContent = data.jobs.industry_name;
            document.getElementById('jobOccupation').textContent = data.jobs.occupation_name;
            document.getElementById('jobRemote').textContent = data.jobs.isRemote ? 'Yes' : 'No';
            document.getElementById('requiredExperience').textContent = data.jobs.requiredExperience;
            document.getElementById('preferredExperience').textContent = data.jobs.preferredExperience;

            // Update page title
            document.title = `${data.jobs.title} at ${data.jobs.company}`;
        } else {
            console.log(`Error: ${response.status} ${response.statusText}`);
            alert("Internal server error.");
        }
    } catch (err) {
        console.error('Error querying database:', err);
    }
});





