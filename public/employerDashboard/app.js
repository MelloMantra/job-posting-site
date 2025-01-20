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
});

// wait function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function openTab(tabNum) {
    return
}