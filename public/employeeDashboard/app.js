document.addEventListener('DOMContentLoaded', async () => {

    // tab stuff
    const tabButtons = document.querySelectorAll('.tabBtn');
    const tabs = document.querySelectorAll('.tab');

    //get 4 jobs
    try {
        const jobs = await fetch('../api/user/get4Jobs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (jobs.ok) {
            var jobsJson = await jobs.json();

            jobsJson = jobsJson.jobs;

            const wrapper = document.querySelector(".jobsWrapper");
            for (let i=0; i<jobsJson.length; i++) {
                var jobListing = document.createElement("div");
                jobListing.className = "jobListing";
                var line1 = document.createElement("div");
                line1.className = "line";
                var title = document.createElement("h3");
                title.className = "jobTitle";
                title.classList.add("unselectable");
                title.innerHTML = jobsJson[i].title;
                var moreDots = document.createElement("img");
                moreDots.className = "moreinfo";
                moreDots.id = `job${i+1}`;
                moreDots.src = "../assets/3dots.png";
                line1.appendChild(title);
                line1.appendChild(moreDots);
                var line2 = document.createElement("div");
                line2.className = "line";
                var status = document.createElement("p");
                status.className = `${jobsJson[i].status}Label`;
                status.classList.add("unselectable");
                status.innerHTML = jobsJson[i].status.toUpperCase();
                var company = document.createElement("p");
                company.innerHTML = jobsJson[i].companyName;
                line2.appendChild(status);
                line2.appendChild(company);
                var line3 = document.createElement("div");
                line3.className = "line";
                line3.classList.add("location");
                var locationDiv = document.createElement("div");
                var locationIcon = document.createElement("img");
                locationIcon.src = "../assets/location.png";
                locationDiv.appendChild(locationIcon);
                var locationText = document.createTextNode(" "+(jobsJson[i].address == null ? "Remote" : jobsJson[i].address));
                locationDiv.appendChild(locationText);
                line3.appendChild(locationDiv);
                jobListing.appendChild(line1);
                jobListing.appendChild(line2);
                jobListing.appendChild(line3);

                wrapper.appendChild(jobListing);
            }

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
            var applicationsJson = await applications.json();

            applicationsJson = applicationsJson.applications;

            const wrapper = document.querySelector(".applicationsWrapper");
            for (let i=0; i<applicationsJson.length; i++) {
                var applicationBox = document.createElement("div");
                applicationBox.className = "applicationBox";
                var line1 = document.createElement("div");
                line1.className = "line";
                var title = document.createElement("h3");
                title.className = "jobTitle";
                title.classList.add("unselectable");
                title.innerHTML = applicationsJson[i].jobTitle;
                var moreDots = document.createElement("img");
                moreDots.className = "moreinfo";
                moreDots.id = `app${i+1}`;
                moreDots.src = "../assets/3dots.png";
                line1.appendChild(title);
                line1.appendChild(moreDots);
                var line2 = document.createElement("div");
                line2.className = "line";
                var status = document.createElement("p");
                status.className = `${applicationsJson[i].state}Label`;
                status.classList.add("unselectable");
                status.innerHTML = applicationsJson[i].state.toUpperCase();
                var company = document.createElement("p");
                company.innerHTML = applicationsJson[i].companyName;
                line2.appendChild(status);
                line2.appendChild(company);
                var line3 = document.createElement("div");
                line3.className = "line";
                line3.classList.add("location");
                var creationDiv = document.createElement("div");
                var creationIcon = document.createElement("img");
                creationIcon.src = "../assets/details.png";
                creationDiv.appendChild(creationIcon);
                var creationText = document.createTextNode(" Applied on "+formatDate(applicationsJson[i].created_at));
                creationDiv.appendChild(creationText);
                line3.appendChild(creationDiv);
                applicationBox.appendChild(line1);
                applicationBox.appendChild(line2);
                applicationBox.appendChild(line3);

                wrapper.appendChild(applicationBox);
            }

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

    // tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', async () => {
            await openTab(button.id.charAt(3));
        });
    });

    // tab refreshing
    const appsTab = document.getElementById('tab3');
    const appsIframe = document.getElementById('allApps');
    appsTab.addEventListener('click', () => {
        appsIframe.src = "../allUserApps";
    });

    // pop up menu stuff
    const jobBoxes = document.querySelectorAll('.jobListing');
    const jobActionBtns = document.querySelectorAll('.jobListing img.moreinfo');
    const appActionBtns = document.querySelectorAll('.applicationBox img.moreinfo');
    const popUpActions = document.querySelectorAll('.dropdownItem');
    const popUp = document.querySelector('.popUp');
    const container = document.querySelector('.contentwrapper');
    const detailsBtn = document.getElementById("detailsPop");
    targetBox = "";

    detailsBtn.addEventListener('click', () => {
        if (targetBox.substring(0,3)=="job") {
            window.open("../jobDetails/job.html");
        } else {
            window.open("../jobDetails/app.html");
        }
    });

    document.addEventListener('click', (event) => {
        if (!popUp.contains(event.target) && !event.target.matches('.moreinfo')) {
            popUp.style.opacity = 0;
        }
    });

    jobActionBtns.forEach(button => {
        button.addEventListener('click', async (event) => {
            targetBox = button.id;
            for (i=0; i<popUpActions.length; i++) {
                if (i==0) {continue};
                var action = popUpActions[i];
                action.style.cursor = "pointer";
                if (action.id == 'detailsPop' || action.id == 'applyPop') {action.style.display = 'flex'}
                else {action.style.display = "none"};
            }
            if (popUp.style.opacity == 0) {
                popUp.style.top = `${button.getBoundingClientRect().top - container.getBoundingClientRect().top - 20}px`;
                popUp.style.left = `${button.getBoundingClientRect().left - container.getBoundingClientRect().left - 20}px`;
                await wait(100);
                popUp.style.opacity = 1;                
            } else {
                if ((popUp.style.top == `${(Math.round((button.getBoundingClientRect().top + Number.EPSILON)*1000) - Math.round((container.getBoundingClientRect().top + Number.EPSILON)*1000) - 20000)/1000}px`) && (popUp.style.left == `${(Math.round((button.getBoundingClientRect().left + Number.EPSILON)*1000) - Math.round((container.getBoundingClientRect().left + Number.EPSILON)*1000) - 20000)/1000}px`)) {
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
            targetBox = button.id;
            for (i=0; i<popUpActions.length; i++) {
                if (i==0) {continue};
                var action = popUpActions[i];
                if (action.id == 'detailsPop' || action.id == 'editPop' || action.id == 'withdrawPop') {action.style.display = 'flex'}
                else {
                    action.style.display = "none";
                    if (popUpActions[i-1].style.display=='flex') {popUpActions[i-1].style.borderRadius = "0px 0px 10px 10px"};
                };
            }
            if (popUp.style.opacity == 0) {
                popUp.style.top = `${button.getBoundingClientRect().top - container.getBoundingClientRect().top - 20}px`;
                popUp.style.left = `${button.getBoundingClientRect().left - container.getBoundingClientRect().left - 20}px`;
                await wait(100);
                popUp.style.opacity = 1;                
            } else {
                if ((popUp.style.top == `${(Math.round((button.getBoundingClientRect().top + Number.EPSILON)*1000) - Math.round((container.getBoundingClientRect().top + Number.EPSILON)*1000) - 20000)/1000}px`) && (popUp.style.left == `${(Math.round((button.getBoundingClientRect().left + Number.EPSILON)*1000) - Math.round((container.getBoundingClientRect().left + Number.EPSILON)*1000) - 20000)/1000}px`)) {
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
    employeeData = {
        fullName: "john deere",
        email: "contact@techcorp.com",
        description: "Leading provider of innovative software solutions..."
    };
    initializeProfile();
});

function formatDate(dateStr) {
const date = new Date(dateStr);
const readableDate = date.toLocaleDateString("en-US", {
year: "numeric",
month: "long",
day: "numeric",
});
return readableDate;
}

// wait function
function wait(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

async function openTab(tabNum) {
const button = document.getElementById(`tab${tabNum}`)
document.querySelector('.tabBtn.active').classList.remove('active');
button.classList.add('active');
        
const tab = document.querySelector('.tab.active');
var steps = 30
for (var i=1; i<steps; i++) {
    tab.style.opacity = 1-(i/steps);
    await wait(1);
}
tab.classList.remove('active');

const targetTab = document.querySelectorAll(".tab")[tabNum-1];
targetTab.classList.add('active');
for (var i=1; i<steps; i++) {
    targetTab.style.opacity = i/steps;
    await wait(1);
}
}


// romir's functions
function initializeProfile() {
document.getElementById('full-name-value').textContent = employeeData.fullName;
document.getElementById('email-value').textContent = employeeData.email;
document.getElementById('description-value').textContent = employeeData.description;
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

document.addEventListener('click', function(event) {
if (event.target && event.target.tagName === 'A' && event.target.getAttribute('href')) {
    event.preventDefault();
    const targetUrl = event.target.getAttribute('href');
    insertHTML(fetchHTML(targetUrl));
}
});


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
        case 'full-name':
            employeeData.fullName = newValue;
            break;
        case 'email':
            employeeData.email = newValue;
            break;
        case 'description':
            employeeData.description = newValue;
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
    case 'full-name':
        return 'fullName';
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