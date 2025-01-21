// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', async () => {
    gsap.registerPlugin(ScrollTrigger);

    // tab stuff
    const tabButtons = document.querySelectorAll('.tabBtn');
    const tabs = document.querySelectorAll('.tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', async () => {

            document.querySelector('.tabBtn.active').classList.remove('active');
            button.classList.add('active');
            
            const tab = document.querySelector('.tab.active');
            var steps = 30
            for (var i=1; i<steps; i++) {
                tab.style.opacity = 1-(i/steps);
                await wait(1);
            }
            tab.classList.remove('active');

            const targetTab = document.getElementById(button.dataset.tab);
            targetTab.classList.add('active');
            for (var i=1; i<steps; i++) {
                targetTab.style.opacity = i/steps;
                await wait(1);
            }
        });
    });

    // pop up menu stuff
    const jobBoxes = document.querySelectorAll('.jobListing');
    const jobActionBtns = document.querySelectorAll('.jobListing img.moreinfo');
    const appActionBtns = document.querySelectorAll('.applicantBox img.moreinfo');
    const popUpActions = document.querySelectorAll('.dropdownItem');
    const popUp = document.querySelector('.popUp');
    const container = document.querySelector('.contentwrapper');

    document.addEventListener('click', (event) => {
        if (!popUp.contains(event.target) && !event.target.matches('.moreinfo')) {
            popUp.style.opacity = 0;
        }
    });

    jobActionBtns.forEach(button => {
        button.addEventListener('click', async (event) => {
            if (popUp.style.opacity == 0) {
                popUp.style.top = `${button.getBoundingClientRect().top - container.getBoundingClientRect().top - 20}px`;
                popUp.style.left = `${button.getBoundingClientRect().left - container.getBoundingClientRect().left - 20}px`;
                await wait(100);
                popUp.style.opacity = 1;
                for (i=0; i<popUpActions.length; i++) {
                    if (i==0) {continue};
                    var action = popUpActions[i];
                    if (action.id == 'reviewPop' || action.id == 'editPop' || action.id == 'endListingPop') {action.style.display = 'flex'}
                    else if (popUpActions[i-1].style.display=='flex') {popUpActions[i-1].style.borderRadius = "0px 0px 10px 10px"};
                }

                popUpActions.forEach(action => {
                    if (action.id == 'popUpTitle' || action.id == 'reviewPop' || action.id == 'editPop' || action.id == 'endListingPop') {
                        action.style.display = 'flex';
                    } else {
                        action.style.display = 'none';
                    }
                });
            } else {
                if ((popUp.style.top == `${(Math.round((button.getBoundingClientRect().top + Number.EPSILON)*100) - Math.round((container.getBoundingClientRect().top + Number.EPSILON)*100) - 2000)/100}px`) && (popUp.style.left == `${(Math.round((button.getBoundingClientRect().left + Number.EPSILON)*100) - Math.round((container.getBoundingClientRect().left + Number.EPSILON)*100) - 2000)/100}px`)) {
                    popUp.style.opacity = 0;
                } else {
                    popUp.style.top = `${button.getBoundingClientRect().top - container.getBoundingClientRect().top - 20}px`;
                    popUp.style.left = `${button.getBoundingClientRect().left - container.getBoundingClientRect().left - 20}px`;
                }
            }
            event.stopPropagation();
        });
    });

    appActionBtns.forEach(button => {
        button.addEventListener('click', async (event) => {
            if (popUp.style.opacity == 0) {
                popUp.style.top = `${button.getBoundingClientRect().top - container.getBoundingClientRect().top - 20}px`;
                popUp.style.left = `${button.getBoundingClientRect().left - container.getBoundingClientRect().left - 20}px`;
                await wait(100);
                popUp.style.opacity = 1;
                for (i=0; i<popUpActions.length; i++) {
                    if (i==0) {continue};
                    var action = popUpActions[i];
                    if (action.id == 'reviewPop' || action.id == 'editPop' || action.id == 'endListingPop') {action.style.display = 'flex'}
                    else if (popUpActions[i-1].style.display=='flex') {popUpActions[i-1].style.borderRadius = "0px 0px 10px 10px"};
                }

                popUpActions.forEach(action => {
                    if (action.id == 'popUpTitle' || action.id == 'reviewPop' || action.id == 'editPop' || action.id == 'endListingPop') {
                        action.style.display = 'flex';
                    } else {
                        action.style.display = 'none';
                    }
                });
            } else {
                if ((popUp.style.top == `${(Math.round((button.getBoundingClientRect().top + Number.EPSILON)*100) - Math.round((container.getBoundingClientRect().top + Number.EPSILON)*100) - 2000)/100}px`) && (popUp.style.left == `${(Math.round((button.getBoundingClientRect().left + Number.EPSILON)*100) - Math.round((container.getBoundingClientRect().left + Number.EPSILON)*100) - 2000)/100}px`)) {
                    popUp.style.opacity = 0;
                } else {
                    popUp.style.top = `${button.getBoundingClientRect().top - container.getBoundingClientRect().top - 20}px`;
                    popUp.style.left = `${button.getBoundingClientRect().left - container.getBoundingClientRect().left - 20}px`;
                }
            }
            event.stopPropagation();
        });
    });

    // romir's profile code
    employerData = {
        companyName: "TechCorp Solutions",
        email: "contact@techcorp.com",
        description: "Leading provider of innovative software solutions..."
    };
    initializeProfile();

    // spencer's get jobs code
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

// wait function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function openTab(tabNum) {
    return
}



function initializeProfile() {
    document.getElementById('company-name-value').textContent = employerData.companyName;
    document.getElementById('email-value').textContent = employerData.email;
    document.getElementById('description-value').textContent = employerData.description;
}

function startEditing(fieldId) {
    const fieldContent = document.getElementById(`${fieldId}-field`);
    const fieldValue = document.getElementById(`${fieldId}-value`);
    const currentValue = fieldValue.textContent;

    fieldContent.classList.add('editing');
    
    const input = document.createElement(fieldId === 'description' ? 'textarea' : 'input');
    input.value = currentValue;
    input.className = `field-input ${fieldId === 'description' ? 'field-textarea' : ''}`;
    
    if (fieldId === 'email') {
        input.type = 'email';
    }

    const saveCancel = document.createElement('div');
    saveCancel.className = 'save-cancel';
    saveCancel.innerHTML = `
        <button class="save-btn" onclick="saveChanges('${fieldId}')">Save Changes</button>
        <button class="cancel-btn" onclick="cancelEditing('${fieldId}')">Cancel</button>
    `;

    fieldContent.innerHTML = '';
    fieldContent.appendChild(input);
    fieldContent.appendChild(saveCancel);
    input.focus();
}

function saveChanges(fieldId) {
    const fieldContent = document.getElementById(`${fieldId}-field`);
    const input = fieldContent.querySelector('.field-input');
    const newValue = input.value.trim();

    if (!newValue) {
        showError(`${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} cannot be empty`);
        return;
    }

    if (fieldId === 'email' && !isValidEmail(newValue)) {
        showError('Please enter a valid email address');
        return;
    }

    const loading = document.createElement('div');
    loading.className = 'loading';
    fieldContent.appendChild(loading);

    setTimeout(() => {
        switch(fieldId) {
            case 'company-name':
                employerData.companyName = newValue;
                break;
            case 'email':
                employerData.email = newValue;
                break;
            case 'description':
                employerData.description = newValue;
                break;
        }

        fieldContent.classList.remove('editing');
        fieldContent.innerHTML = `<div class="field-value" id="${fieldId}-value">${newValue}</div>`;

        const success = document.createElement('div');
        success.className = 'success-message';
        success.textContent = 'Changes saved successfully';
        document.body.appendChild(success);

        setTimeout(() => success.remove(), 2500);
    }, 800);
}

function cancelEditing(fieldId) {
    const fieldContent = document.getElementById(`${fieldId}-field`);
    fieldContent.classList.remove('editing');
    fieldContent.innerHTML = `<div class="field-value" id="${fieldId}-value">${employerData[mapFieldToProperty(fieldId)]}</div>`;
}

function mapFieldToProperty(fieldId) {
    switch(fieldId) {
        case 'company-name':
            return 'companyName';
        default:
            return fieldId;
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(message) {
    const error = document.createElement('div');
    error.className = 'success-message';
    error.style.background = '#ef4444';
    error.textContent = message;
    document.body.appendChild(error);
    setTimeout(() => error.remove(), 2500);
}

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