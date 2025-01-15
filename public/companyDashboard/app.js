// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // tab stuff
    const tabButtons = document.querySelectorAll('.tabBtn');
    const tabs = document.querySelectorAll('.tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.tabBtn.active').classList.remove('active');
            document.querySelector('.tab.active').classList.remove('active');
            button.classList.add('active');
            const targetTab = document.getElementById(button.dataset.tab);
            targetTab.classList.add('active');
        });
    });

    // pop up menu stuff
    const jobs = document.querySelectorAll('.jobListing');

    for (i=0; i<jobs.length; i++) {
        
        //addEventListener
    }
});
