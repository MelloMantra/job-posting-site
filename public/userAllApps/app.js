var applications;
document.addEventListener("DOMContentLoaded", async function () {
    
    try {
        const response = await fetch('../api/user/getApplications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            applications = await response.json();
            console.log(applications);
        } else {
            console.log(`Error: ${response.status} ${response.statusText}`);
            alert("Internal server error.");
        }
    } catch (err) {
        console.error('Error Querying Database:', err);
        alert('Error Querying Database');
    }

    renderApplications(applications.applications);
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
        <div class="application-card ${app.state === 'accepted' ? 'accepted-card' : ''}"
             data-status="${app.state}">
            <div class="company-name">${app.companyName}</div>
            <div class="position">${app.title}</div>
            <div class="status status-${app.state}">
                ${app.state.charAt(0).toUpperCase() + app.state.slice(1)}
            </div>
            <div class="details">
                <span>
                    <span class="location-icon">📍</span>
                    ${app.address}
                </span>
                <span>
                    <span class="calendar-icon">📅</span>
                    Applied: ${new Date(app.created_at).toLocaleDateString()}
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