/*
for anyone coming from searchJobs/app.js:
this js and accompanying html file have the code for a search bar that allows a user to search for occupations (there are over 1000 valid ones) and the dropdown
for industries (20 total). the debounce and showTypeahead functions are what need to be used for the search bar to work. the HTML objects marked by comments "Industry Dropdown"
and "Occupation Search" are the HTML elements you'll want to look at to copy the functionality. 

Keep in mind, the occupation search is more of an autocomplete system, not like a search engine type of thing, where you type in a query and get results, rather, this
is functionally the same as a dropdown in that it allows you to select an item from a list. That is to say, it is necessary to make sure users have inputted a real
occupation, because there is a set of valid occupations in the database. I'll code a function in searchJobs/app.js to check for you but you will have to implement it.
*/
var occupation = null;

//BTW: romir, please make it so that users can only type in numbers in the estimated pay field, otherwise it can cause a lot of confusion if they try and do like "ten dollars" or something like that

function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

const showTypeahead = debounce(async (field) => {
    const input = document.getElementById(field);
    const typeahead = document.getElementById(`${field}Typeahead`);
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
            div.onclick = () => {
                input.value = match.name;
                occupation = match.id;
                typeahead.classList.add('hidden');
            };
            typeahead.appendChild(div);
        });
        
        typeahead.classList.remove('hidden');
    } else {
        typeahead.classList.add('hidden');
    }  
}, 300);

document.getElementById('jobForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // get form data
    const titleInput = document.getElementById('title');  
    const title = titleInput.value;

    const addressInput = document.getElementById('address');
    const address = addressInput.value;

    const jobDescriptionInput = document.getElementById('description');
    const description = jobDescriptionInput.value;

    const scheduleInput = document.getElementById('scheduleType');
    const hours = scheduleInput.value;

    const estimatedPayInput = document.getElementById('estimatedPay');
    const estimatedPay = estimatedPayInput.value;

    const preferredExperienceInput = document.getElementById('preferredExperience');
    const preferredExperience = preferredExperienceInput.value;

    const occupationInput = document.getElementById('occupation');
    const occupationValue = occupationInput.value;

    const industryInput = document.getElementById('industry');
    const industry = industryInput.value;

    const isRemoteInput = document.getElementById('isRemote');
    var isRemote = isRemoteInput.value;
    isRemote = isRemote === 'true' ? true : false;


    // validate form data

    if (!description || !hours || !estimatedPay || !preferredExperience || !occupationValue || !industry || !title || isRemote === null || isRemote === undefined) {
        alert('All fields are required.');
        return;
    } else if (!occupation) { //This is a small nitpick but technically if a user inputs a valid occupation but doesn't select it, the form will think they didn't input anything
        alert('Please select a valid occupation.'); //The only solution to the above problem is a real pain though, so I'll leave it like this for now and fix it later if I have time
        return;
    } else if (!Number.isSafeInteger(parseInt(estimatedPay))) {
        alert('Please enter a valid number for estimated pay.');
        return;
    }
    // send form data to backend
    try { 
        const response = await fetch('/api/company/postJob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, address, description, hours, estimatedPay, preferredExperience, occupation, industry, isRemote })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //alert('Job posted successfully.');
            //window.location.href = '/employerDashboard'; //Not 100% sure if this works or not since we've not implemented the dashboard yet
        } else {
            console.log(`Error: ${response.status} ${response.statusText}`);
            alert('Internal server error.');
        }

    } catch (err) {
        console.error('Error querying database:', err);
        alert('Form Submission Error.');
    }
});

//At the moment basically nothing happens frontend when the user creates the job, just a message in the console. I'll leave it to you to redirect or whatever