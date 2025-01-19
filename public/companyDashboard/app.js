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
    const moreBtns = document.querySelectorAll('.moreinfo');
    const popUp = document.querySelectorAll('.popUp')[0];

    moreBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (popUp.style.opacity == 0) {
                popUp.style.top = `${button.getBoundingClientRect().top - 100}px`;
                popUp.style.left = `${button.getBoundingClientRect().left - 175}px`;
                popUp.style.opacity = 1;
            } else {
                if (popUp.getBoundingClientRect() == button.getBoundingClientRect()) {
                    popUp.style.opacity = 0;
                } else {
                    popUp.style.top = `${button.getBoundingClientRect().top - 100}px`;
                    popUp.style.left = `${button.getBoundingClientRect().left - 175}px`;
                }
            }
        });
    });

    for (i=0; i<jobs.length; i++) {
        
        //jobs[i].addEventListener('cli')
    }
});
