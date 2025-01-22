document.addEventListener("DOMContentLoaded", async function () {
    var data;
    
    try {
        const response = await fetch('../api/user/getApplications', {
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
        console.error('Error Querying Database:', err);
        alert('Error Querying Database');
    }
});

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}

/* 
data.applications will contain an array of JSON objects with the following structure:
{
    address: "1234 Place Lane, City, AB"
    companyName: "Name of company"
    created_at: "2025-01-20T07:00:00.000Z" //you may want to use the formatdate on this, since it'll return the date looking a lot prettier (or splice at T)
    estimatedPay: 102 //dollars per hour
    state: "pending" //or "accepted" or "rejected"
    title: "job title"
    job: 10 //this is an ID and is primarily so you can put a link to job/${data.applications[index].job} to show job details from here (i'd leave target = "_blank" peersonally as well)
}
note that I'm not including everything in the JSON object, I'm leaving out some internal variables like ID's and such
*/

const applications = [
    {
        id: 1,
        company: "TechCorp Solutions",
        position: "Frontend Developer",
        status: "accepted",
        date: "2025-01-15",
        location: "Remote"
    },
    {
        id: 2,
        company: "Digital Dynamics",
        position: "UX Designer",
        status: "rejected",
        date: "2025-01-10",
        location: "New York, NY"
    },
    {
        id: 3,
        company: "Innovation Labs",
        position: "Software Engineer",
        status: "pending",
        date: "2025-01-18",
        location: "San Francisco, CA"
    }
];

function fireConfetti() {
    // Shorter duration - 800ms
    const duration = 800;
    const end = Date.now() + duration;

    (function frame() {
        // Increased particle count for shorter but more intense burst
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 70,
            origin: { x: 0, y: 0 },
            gravity: 1.5,
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
            velocity: 2
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 70,
            origin: { x: 1, y: 0 },
            gravity: 1.5,
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
            velocity: 2
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function renderApplications(apps) {
    const grid = document.getElementById('applicationsGrid');
    grid.innerHTML = apps.map(app => `
        <div class="application-card ${app.status === 'accepted' ? 'accepted-card' : ''}"
             data-status="${app.status}">
            <div class="company-name">${app.company}</div>
            <div class="position">${app.position}</div>
            <div class="status status-${app.status}">
                ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}
            </div>
            <div class="details">
                <span>
                    <span class="location-icon">📍</span>
                    ${app.location}
                </span>
                <span>
                    <span class="calendar-icon">📅</span>
                    Applied: ${new Date(app.date).toLocaleDateString()}
                </span>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.accepted-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            fireConfetti();
        });
    });
}

document.getElementById('searchBar').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = applications.filter(app => 
        app.company.toLowerCase().includes(searchTerm) ||
        app.position.toLowerCase().includes(searchTerm)
    );
    renderApplications(filtered);
});

// Initial render
renderApplications(applications);