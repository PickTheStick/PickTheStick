document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const pointsString = urlParams.get('points');

    try {
        if (pointsString !== null) {
            const points = JSON.parse(pointsString);

            const positivePoints = points.positivePoints || {};
            for (const key in positivePoints) {
                if (positivePoints.hasOwnProperty(key)) {
                    document.getElementById(key).value = positivePoints[key];
                }
            }

            const neutralPoints = points.neutralPoints || {};
            for (const key in neutralPoints) {
                if (neutralPoints.hasOwnProperty(key)) {
                    document.getElementById(key).value = neutralPoints[key];
                }
            }

            const negativePoints = points.negativePoints || {};
            for (const key in negativePoints) {
                if (negativePoints.hasOwnProperty(key)) {
                    document.getElementById(key).value = negativePoints[key];
                }
            }
        }
    } catch (error) {
        console.error('Error parsing points:', error);
    }

    const statForm = document.getElementById('statForm');
    const resetButton = document.getElementById('resetButton');
    const calculateButton = document.getElementById('calculateButton');

    if (statForm) {
        statForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const walks = parseInt(document.getElementById('walks').value) || 0;
            const single = parseInt(document.getElementById('single').value) || 0;
            const double = parseInt(document.getElementById('double').value) || 0;
            const triple = parseInt(document.getElementById('triple').value) || 0;
            const homeRun = parseInt(document.getElementById('homeRun').value) || 0;
            const SB = parseInt(document.getElementById('SB').value) || 0;
            const sacrifice = parseInt(document.getElementById('sacrifice').value) || 0;
            const rbis = parseInt(document.getElementById('rbis').value) || 0;
            const runs = parseInt(document.getElementById('runs').value) || 0;
            const outs = parseInt(document.getElementById('outs').value) || 0;
            const roe = parseInt(document.getElementById('roe').value) || 0;
            const strikeouts = parseInt(document.getElementById('strikeouts').value) || 0;
            const caughtStealing = parseInt(document.getElementById('caughtStealing').value) || 0;
            const doublePlay = parseInt(document.getElementById('doublePlay').value) || 0;
            const rispLob = parseInt(document.getElementById('rispLob').value) || 0;
            const failedToGetRunner = parseInt(document.getElementById('failedToGetRunner').value) || 0;

            const totalPoints = calculatePoints(walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs, outs, roe, strikeouts, caughtStealing, doublePlay, rispLob, failedToGetRunner);
            const resultDescription = generateResultDescription(walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs, outs, roe, strikeouts, caughtStealing, doublePlay, rispLob, failedToGetRunner);

            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `<p>Earned ${totalPoints.toFixed(2)} points. ${resultDescription}</p>`;

            calculateButton.style.display = 'none';
            resetButton.style.display = 'inline-block';
        });

        document.getElementById('homeRun').addEventListener('input', function() {
            const homeRunValue = parseInt(this.value) || 0;
            const rbisInput = document.getElementById('rbis');
            const runsInput = document.getElementById('runs');
            
            if (homeRunValue > 0) {
                if (parseInt(rbisInput.value) === 0) {
                    rbisInput.value = homeRunValue;
                }
                if (parseInt(runsInput.value) === 0) {
                    runsInput.value = homeRunValue;
                }
            }
        });

        ['strikeouts', 'doublePlay', 'failedToGetRunner'].forEach(function(statId) {
            const inputElement = document.getElementById(statId);
            if (inputElement) {
                inputElement.addEventListener('input', function() {
                    const oldValue = parseInt(this.getAttribute('data-old-value')) || 0;
                    const increaseValue = parseInt(this.value) || 0;
                    const outsInput = document.getElementById('outs');
                    if (increaseValue > oldValue) {
                        outsInput.value = parseInt(outsInput.value) + 1;
                    } else if (increaseValue < oldValue) {
                        outsInput.value = Math.max(parseInt(outsInput.value) - 1, 0);
                    }
                    this.setAttribute('data-old-value', increaseValue);
                });
            }
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', function() {
            statForm.reset();
            document.getElementById('result').innerHTML = '';

            calculateButton.style.display = 'inline-block';
            resetButton.style.display = 'none';
        });
    }
});

function calculatePoints(walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs, outs, roe, strikeouts, caughtStealing, doublePlay, rispLob, failedToGetRunner) {
    let positivePoints = 0;
    let negativePoints = 0;

    positivePoints += walks * 1;
    positivePoints += single * 1;
    positivePoints += double * 2;
    positivePoints += triple * 3;
    positivePoints += homeRun * 4;
    positivePoints += SB * 1;
    positivePoints += sacrifice * 1;
    positivePoints += rbis * 1;
    positivePoints += runs * 1;

    negativePoints += strikeouts * 1;
    negativePoints += caughtStealing * 1;
    negativePoints += doublePlay * 1;
    negativePoints += rispLob * 0.5;
    negativePoints += failedToGetRunner * 2;

    const totalPoints = positivePoints - negativePoints;
    return totalPoints;
}

function generateResultDescription(walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs, outs, roe, strikeouts, caughtStealing, doublePlay, rispLob, failedToGetRunner) {
    const hits = single + double + triple + homeRun;
    const atBats = hits + outs + roe;
    const results = [];

    if (walks > 0) results.push(`${walks} BB/HBP`);
    if (single > 0) results.push(`${single} single${single > 1 ? 's' : ''}`);
    if (double > 0) results.push(`${double} double${double > 1 ? 's' : ''}`);
    if (triple > 0) results.push(`${triple} triple${triple > 1 ? 's' : ''}`);
    if (homeRun > 0) results.push(`${homeRun} HR`);
    if (SB > 0) results.push(`${SB} SB`);
    if (sacrifice > 0) results.push(`${sacrifice} SAC`);
    if (rbis > 0) results.push(`${rbis} RBI's`);
    if (runs > 0) results.push(`${runs} run${runs > 1 ? 's' : ''}`);

    const negativeResults = [];
    if (strikeouts > 0) negativeResults.push(`${strikeouts} strikeout${strikeouts > 1 ? 's' : ''}`);
    if (caughtStealing > 0) negativeResults.push(`${caughtStealing} caught stealing`);
    if (doublePlay > 0) negativeResults.push(`${doublePlay} GIDP`);
    if (rispLob > 0) negativeResults.push(`${rispLob} LOB`);
    if (failedToGetRunner > 0) negativeResults.push(`${failedToGetRunner} Fail`);

    const negativePoints = (strikeouts * 1) + (caughtStealing * 1) + (doublePlay * 1) + (rispLob * 0.5) + (failedToGetRunner * 2);
    return `${hits}/${atBats} (${results.join(', ')}) [ -${negativePoints.toFixed(2)} (${negativeResults.join(', ')})]`;
}
