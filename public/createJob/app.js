/*
for anyone coming from searchJobs/app.js:
this js and accompanying html file have the code for a search bar that allows a user to search for occupations (there are over 1000 valid ones) and the dropdown
for industries. the debounce and showTypeahead functions are what need to be used for the search bar to work. the HTML objects marked by comments "Industry Dropdown"
and "Occupation Search" are the HTML elements you'll want to look at to copy the functionality. 

Keep in mind, the occupation search is more of an autocomplete system, not like a search engine type of thing, where you type in a query and get results, rather, this
is functionally the same as a dropdown in that it allows you to select an item from a list. That is to say, it is necessary to make sure users have inputted a real
occupation, because there is a set of valid occupations in the database. I'll code a function in searchJobs/app.js to check for you but you will have to implement it.
*/

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
                typeahead.classList.add('hidden');
            };
            typeahead.appendChild(div);
        });
        
        typeahead.classList.remove('hidden');
    } else {
        typeahead.classList.add('hidden');
    }  
}, 300);

document.getElementById('jobForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
});