const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

if (menuBtn && sideMenu) {
    menuBtn.addEventListener('click', () => {
        sideMenu.style.display = 'block';
    })
}

if (closeBtn && sideMenu) {
    closeBtn.addEventListener('click', () => {
        sideMenu.style.display = 'none';
    })
}




const stepPanels = document.querySelectorAll('.step-panel');

if (stepPanels.length) {
    const stepperSteps = document.querySelectorAll('.stepper-step');
    const prevBtn = document.querySelector('[data-prev]');
    const nextBtn = document.querySelector('[data-next]');
    const stepCount = document.querySelector('.step-count');
    const total = stepPanels.length;
    let current = 1;

    function showStep(n) {
        current = Math.min(Math.max(n, 1), total);

        stepPanels.forEach(panel => {
            panel.hidden = Number(panel.dataset.step) !== current;
        });

        
        stepperSteps.forEach((step, i) => {
            step.classList.toggle('done', i + 1 < current);
            step.classList.toggle('current', i + 1 === current);
        });

        prevBtn.disabled = current === 1;
        nextBtn.hidden = current === total;   
        stepCount.textContent = `Step ${current} of ${total}`;

        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', () => showStep(current - 1));
    nextBtn.addEventListener('click', () => showStep(current + 1));

    showStep(2);   
}




document.querySelectorAll('.epds .score-cell').forEach(cell => {
    cell.querySelectorAll('.score').forEach(score => {
        score.addEventListener('click', () => {
            const flagged = cell.closest('tr').classList.contains('row-flagged');
            cell.querySelectorAll('.score').forEach(s => s.classList.remove('on', 'on-high'));
            score.classList.add(flagged ? 'on-high' : 'on');
        });
    });
});




const qSteps = document.querySelectorAll('.q-step');

if (qSteps.length) {
    const TOTAL_QUESTIONS = 10;          
    const qPrev = document.querySelector('[data-q-prev]');
    const qNext = document.querySelector('[data-q-next]');
    const qFill = document.querySelector('[data-q-fill]');
    const qCurrent = document.querySelector('[data-q-current]');
    let q = 3;                            

    function showQuestion(n) {
        q = Math.min(Math.max(n, 1), qSteps.length);

        qSteps.forEach(step => {
            step.hidden = Number(step.dataset.q) !== q;
        });

        qFill.style.width = (q / TOTAL_QUESTIONS * 100) + '%';
        qCurrent.textContent = q;
        qPrev.disabled = q === 1;
    }

    qPrev.addEventListener('click', () => showQuestion(q - 1));
    qNext.addEventListener('click', () => showQuestion(q + 1));

    
    document.querySelectorAll('.q-options').forEach(group => {
        group.querySelectorAll('.q-option').forEach(option => {
            option.addEventListener('click', () => {
                group.querySelectorAll('.q-option')
                     .forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    });

    showQuestion(q);
}