    // Event listener for pressing Enter key in the search input
    document.getElementById("search-query").addEventListener("keypress", function(event) {
        if (event.key === 'Enter') {
            const query = document.getElementById("search-query").value;
            const filters = {
                industry: document.getElementById("industry").value,
                occupation: occupation,
                isRemote: document.getElementById("remote").value,
                minPay: document.getElementById("salary").value,
                jobType: document.getElementById("job-type").value,
                sort: document.getElementById("sort-date").value || 'estimatedPay' // Default sort order
            };

            searchJobs(query, filters);
        }
    });

    document.getElementById("search-btn").addEventListener("click", function(event) {
            const query = document.getElementById("search-query").value;

            const filters = {
                industry: document.getElementById("industry").value,
                occupation: occupation,
                isRemote: document.getElementById("remote").value,
                minPay: document.getElementById("salary").value,
                jobType: document.getElementById("job-type").value,
                sort: document.getElementById("sort-date").value || 'estimatedPay' // Default sort order
            };

            searchJobs(query, filters);
    });

    // Function to search jobs based on query and filters
    async function searchJobs(query, filterOptions) {
        if (!query) {
            return [];
        }

        try {
            let URL = `../api/all/searchJobs?query=${query}`;

            if (filterOptions?.industry) {
                URL += `&industry=${filterOptions.industry}`;
            }

            if (filterOptions?.occupation) {
                URL += `&occupation=${filterOptions.occupation}`;
            }

            if (filterOptions?.isRemote !== undefined) {
                URL += `&isRemote=${filterOptions.isRemote}`;
            }

            if (filterOptions?.minPay) {
                URL += `&minPay=${filterOptions.minPay}`;
            }

            if (filterOptions?.jobType) {
                URL += `&jobType=${filterOptions.jobType}`;
            }

            if (filterOptions?.sort) {
                URL += `&sort=${filterOptions.sort}`;
            }

            const response = await fetch(URL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                alert("Internal server error.");
                console.log(await response.json());
                return [];
            }

            const data = await response.json();
            console.log("searchData", data);
            displayJobs(data.result);
        } catch (err) {
            console.error('Error querying database:', err);
            return [];
        }
    }

    // Function to display jobs in the UI
    function displayJobs(jobs) {
        const jobListElement = document.getElementById("job-list");
        jobListElement.innerHTML = ""; // Clear previous jobs

        if (jobs.length === 0) {
            alert("No jobs found.");
        }

        jobs.forEach(job => {
            const jobItem = document.createElement("div");
            jobItem.classList.add("job-item");
            jobItem.id = `job-item-${job.id}`;
            jobItem.innerHTML = `
                <div class="title"><a href="/job/${job.id}" target="_blank">${job.title}</a></div>
                <div class="company"><a href="/companyProfile/${job.companyName}" target="_blank">${job.companyName}</a></div>
                <div class="location">${job.isRemote ? "Remote" : job.address}</div>
                <div class="pay">$${job.estimatedPay}/hour</div>
                <div class="industry">${job.industryName}</div>
                <div class="occupation">${job.occupationName}</div>
                <button class="apply-button" onclick="applyToJob(${job.id})">Apply Now</button>
            `;
            jobListElement.appendChild(jobItem);
        });
    }

    async function applyToJob(jobId) {
        const jobItem = document.getElementById(`job-item-${jobId}`);
        jobItem.style.display = "none";
        
        var data;

        try {
            const response = await fetch(`../api/user/applyToJob/${jobId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                alert("Internal server error.");
                console.log(await response.json());
                return;
            }

            data = await response.json();
            console.log(data.message);
        } catch (err) {
            console.error('Error querying database:', err);
            alert('Application Submission Error.');
            return;
        }

        uploadResume(jobId, data.applicationId);
    }

    function uploadResume(jobId, applicationId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf';

        input.click();

        input.onchange = async (event) => {
            const file = event.target.files[0]; 

            if (file) {
                if (file.type !== 'application/pdf') {
                    alert('Please select a valid PDF file.');
                    return;
                }

                const formData = new FormData();
                formData.append('resume', file); 

                try {
                    const response = await fetch(`../api/user/uploadResume/${jobId}/${applicationId}`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        const result = await response.json();
                    } else {
                        const result = await response.json();
                        alert(result.error || 'Failed to upload resume.');
                    }
                } catch (error) {
                    console.error('Error uploading resume:', error);
                    alert('An error occurred while uploading the resume.');
                }
            }
        }
    }

var occupation;
    function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

const showTypeahead = debounce(async (field) => {
    const input = document.getElementById(field);
    const typeahead = document.getElementById(`occupationTypeahead`);
    typeahead.innerHTML = '';

    const query = input.value;
    if (query) {
        var matches;
        try {
            matches = await fetch(`../api/all/searchCategory/${field}?query=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (matches.ok) {
                matches = await matches.json();
                console.log(matches);
                /* Matches will look something like this:
                {
                    "result": [
                        {
                            "id": 1,
                            "name": "Occupation Name"
                        },
                        {
                            "id": 2,
                            "name": "Occupation Name"
                        },
                        {
                            "id": 3,
                            "name": "Occupation Name"
                        }
                    ]
                }

                note that you need to use matches.result to get the actual content, not just matches
                */
            } else {
                console.log(`Error: ${matches.status} ${matches.statusText}`);
                alert("Internal server error.");
            }
            if (matches.result.length === 0) {
                typeahead.classList.add('hidden');
                return;
            }
        } catch (err) {
            console.error('Error querying database:', err);
        }

        matches.result.forEach(match => {
            const div = document.createElement('div');
            div.className = 'typeahead-item';
            div.textContent = match.name;
            div.addEventListener('click', () => {
                input.value = match.name;
                occupation = match.id;
                typeahead.style.display = 'none';
            });
            typeahead.appendChild(div);
        });
        
        typeahead.style.display = 'block';
    } else {
        typeahead.style.display = 'none';
    }  
}, 300);