/*
const occupations = [
    'Software Engineer', 'Data Scientist', 'Product Manager', 'Designer', 
    'Marketing Specialist', 'Sales Representative', 'Customer Support', 
    'HR Manager', 'Finance Analyst', 'IT Support'
];

const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 
    'Retail', 'Manufacturing', 'Transportation', 
    'Real Estate', 'Hospitality', 'Energy' 
];
*/
//Above are the lists of occupations and industries, no longer in use since the data is stored in the database and fetched from there

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
    // Handle form submission here
    alert('Job posting created successfully!');
});