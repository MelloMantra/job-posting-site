// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
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
    const jobs = document.querySelectorAll('.jobListing');
    const moreBtns = document.querySelectorAll('.jobListing img.moreinfo');
    const popUp = document.querySelector('.popUp');
    const container = document.querySelector('.contentwrapper');

    document.addEventListener('click', (event) => {
        if (!popUp.contains(event.target) && !event.target.matches('.moreinfo')) {
            popUp.style.opacity = 0;
        }
    });

    moreBtns.forEach(button => {
        button.addEventListener('click', async (event) => {
            if (popUp.style.opacity == 0) {
                popUp.style.top = `${button.getBoundingClientRect().top - container.getBoundingClientRect().top - 20}px`;
                popUp.style.left = `${button.getBoundingClientRect().left - container.getBoundingClientRect().left - 20}px`;
                await wait(100);
                popUp.style.opacity = 1;
            } else {
                if (popUp.getBoundingClientRect() == button.getBoundingClientRect()) {
                    popUp.style.opacity = 0;
                } else {
                    popUp.style.top = `${button.getBoundingClientRect().top - container.getBoundingClientRect().top - 20}px`;
                    popUp.style.left = `${button.getBoundingClientRect().left - container.getBoundingClientRect().left - 20}px`;
                }
            }
            event.stopPropagation();
        });
    });
});

// wait function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}