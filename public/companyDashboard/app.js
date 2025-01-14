// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Get all tab buttons and tab content sections
    const tabButtons = document.querySelectorAll('.tabBtn');
    const tabs = document.querySelectorAll('.tab');

    // Add event listeners to each tab button
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.tabBtn.active').classList.remove('active');
            document.querySelector('.tab.active').classList.remove('active');
            button.classList.add('active');
            const targetTab = document.getElementById(button.dataset.tab);
            targetTab.classList.add('active');
        });
    });
});
