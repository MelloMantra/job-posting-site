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

function showTypeahead(field) {
    const input = document.getElementById(field);
    const list = field === 'occupation' ? occupations : industries;
    const typeahead = document.getElementById(`${field}Typeahead`);
    typeahead.innerHTML = '';
    const query = input.value.toLowerCase();
    if (query) {
        const matches = list.filter(item => item.toLowerCase().includes(query));
        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'typeahead-item';
            div.textContent = match;
            div.onclick = () => {
                input.value = match;
                typeahead.classList.add('hidden');
            };
            typeahead.appendChild(div);
        });
        typeahead.classList.remove('hidden');
    } else {
        typeahead.classList.add('hidden');
    }
}

document.getElementById('jobForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle form submission
});