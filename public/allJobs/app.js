
gsap.registerPlugin(ScrollTrigger);

/*
const jobs = [
    {
        title: "Senior Frontend Developer",
        description: "Looking for an experienced frontend developer with 5+ years of experience in React and modern JavaScript frameworks.",
        date: "2024-01-15",
        applicants: 45
    },
    {
        title: "UX/UI Designer",
        description: "Seeking a creative designer with strong portfolio and experience in designing modern web applications.",
        date: "2024-01-14",
        applicants: 32
    },
    {
        title: "DevOps Engineer",
        description: "Experience with AWS, Docker, and CI/CD pipelines required. Knowledge of Kubernetes is a plus.",
        date: "2024-01-13",
        applicants: 28
    },
    {
        title: "Backend Developer",
        description: "Experience with Node.js, Express, and MongoDB is a plus. Strong knowledge of RESTful APIs.",
        date: "2024-01-12",
        applicants: 22
    },
];

function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <div class="job-content">
            <h2 class="job-title">${job.title}</h2>
            <p class="job-description">${job.description}</p>
        </div>
        <div class="job-footer">
            <div class="job-meta">
                <span class="job-date">${formatDate(job.date)}</span>
                <span class="job-applicants">${job.applicants} applicants</span>
            </div>
            <button class="view-button">View Details</button>
        </div>
    `;
    return card;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}

document.addEventListener('DOMContentLoaded', () => {
    const jobsGrid = document.querySelector('.jobs-grid');
    jobs.forEach(job => {
        const card = createJobCard(job);
        jobsGrid.appendChild(card);
    });

    setTimeout(() => {
        document.querySelector('.loading-overlay').style.display = 'none';
    }, 1500);
});
*/
async function fetchJobs() {
    try {
        const response = await fetch('../api/company/getJobs', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch jobs.');
        }

        const data = await response.json();
        console.log(data);
        return data.jobs || [];
    } catch (err) {
        console.error('Error fetching jobs:', err);
        alert('An error occurred while fetching jobs. Please try again later.');
        return [];
    }
}

function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <div class="job-content">
            <a class="job-title" href="../job/${job.id}" target="_blank" style="text-decoration: none; font-weight: bold; font-size: 1.5em; color: inherit; display: inline-block;">${job.title}</a>
            <p class="job-description">${job.description}</p>
        </div>
        <div class="job-footer">
            <div class="job-meta">
                <span class="job-date">${formatDate(job.date_created)}</span>
                <span class="job-applicants">${job.applicantCount || 0} applicants</span>
            </div>
            <a class="view-button" href="../allApps/${job.id}">View Details</a>
        </div>
    `;
    return card;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}

document.addEventListener('DOMContentLoaded', async () => {
    const jobsGrid = document.querySelector('.jobs-grid');

    const jobs = await fetchJobs();
    jobs.forEach(job => {
        console.log(job);
        const card = createJobCard(job);
        jobsGrid.appendChild(card);
    });

    setTimeout(() => {
        document.getElementsByClassName('loading-overlay')[0].style.display = 'none';
    }, 1500);
});

const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const jobCards = document.querySelectorAll('.job-card');

    if (searchTerm === '') {
        jobCards.forEach(card => {
            card.style.display = 'flex';
            gsap.to(card, {
                opacity: 1,
                duration: 0.3
            });
        });
        return;
    }

    jobCards.forEach(card => {
        const title = card.querySelector('.job-title').textContent.toLowerCase();
        const description = card.querySelector('.job-description').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'flex';
            gsap.to(card, {
                opacity: 1,
                duration: 0.3
            });
        } else {
            gsap.to(card, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    card.style.display = 'none';
                }
            });
        }
    });
});