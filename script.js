document.getElementById('statForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const playerName = document.getElementById('playerName').value;
    const gameDate = document.getElementById('gameDate').value;

    // Get values from positive points input fields
    const walks = parseInt(document.getElementById('walks').value) || 0;
    const single = parseInt(document.getElementById('single').value) || 0;
    const double = parseInt(document.getElementById('double').value) || 0;
    const triple = parseInt(document.getElementById('triple').value) || 0;
    const homeRun = parseInt(document.getElementById('homeRun').value) || 0;
    const sacrifice = parseInt(document.getElementById('sacrifice').value) || 0;
    const rbis = parseInt(document.getElementById('rbis').value) || 0;
    const stolenBases = parseInt(document.getElementById('stolenBases').value) || 0;

    // Get values from negative points input fields
    const outs = parseInt(document.getElementById('outs').value) || 0;
    const doublePlay = parseInt(document.getElementById('doublePlay').value) || 0;
    const leftOnBase = parseInt(document.getElementById('leftOnBase').value) || 0;
    const failedToGetRunner = parseInt(document.getElementById('failedToGetRunner').value) || 0;

    // Calculate total points
    const totalPoints = calculatePoints(walks, single, double, triple, homeRun, sacrifice, rbis, stolenBases, outs, doublePlay, leftOnBase, failedToGetRunner);

    // Display result
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p>${playerName} earned ${totalPoints.toFixed(2)} points on ${gameDate}.</p>`;

    // Hide calculate button and show reset button
    document.getElementById('calculateButton').style.display = 'none';
    document.getElementById('resetButton').style.display = 'inline-block';
});

document.getElementById('resetButton').addEventListener('click', function() {
    // Reset all input values
    document.getElementById('statForm').reset();

    // Clear result display
    document.getElementById('result').innerHTML = '';

    // Clear displayed points in the labels
    clearDisplayedPoints('positive-points');
    clearDisplayedPoints('negative-points');

    // Show calculate button and hide reset button
    document.getElementById('calculateButton').style.display = 'inline-block';
    document.getElementById('resetButton').style.display = 'none';
});

document.getElementById('homeRun').addEventListener('input', function() {
    const homeRunValue = parseInt(this.value) || 0;
    const rbisInput = document.getElementById('rbis');
    const rbisValue = parseInt(rbisInput.value) || 0;

    if (homeRunValue > 0 && rbisValue === 0) {
        rbisInput.value = homeRunValue;
    }
});

function calculatePoints(walks, single, double, triple, homeRun, sacrifice, rbis, stolenBases, outs, doublePlay, leftOnBase, failedToGetRunner) {
    let positivePoints = 0;
    let negativePoints = 0;

    // Positive points
    positivePoints += walks * 0.25;
    positivePoints += single * 0.5;
    positivePoints += double * 0.6;
    positivePoints += triple * 0.7;
    positivePoints += homeRun * 0.5;
    positivePoints += sacrifice * 0.25;
    positivePoints += rbis * 0.3;
    positivePoints += stolenBases * 0.5;

    // Negative points
    negativePoints += outs * 0.1;
    negativePoints += doublePlay * 0.25;
    negativePoints += leftOnBase * 0.15;
    negativePoints += failedToGetRunner * 0.25;

    const totalPoints = positivePoints - negativePoints;

    // Display net points next to titles and subtitles
    displayNetPoints('positive-points', positivePoints, 'green');
    displayNetPoints('negative-points', negativePoints, 'red');

    displaySubPoints('positive-points', 'walks', walks * 0.25, 'green');
    displaySubPoints('positive-points', 'single', single * 0.5, 'green');
    displaySubPoints('positive-points', 'double', double * 0.6, 'green');
    displaySubPoints('positive-points', 'triple', triple * 0.7, 'green');
    displaySubPoints('positive-points', 'homeRun', homeRun * 0.5, 'green');
    displaySubPoints('positive-points', 'sacrifice', sacrifice * 0.25, 'green');
    displaySubPoints('positive-points', 'rbis', rbis * 0.3, 'green');
    displaySubPoints('positive-points', 'stolenBases', stolenBases * 0.5, 'green');

    displaySubPoints('negative-points', 'outs', outs * 0.1, 'red');
    displaySubPoints('negative-points', 'doublePlay', doublePlay * 0.25, 'red');
    displaySubPoints('negative-points', 'leftOnBase', leftOnBase * 0.15, 'red');
    displaySubPoints('negative-points', 'failedToGetRunner', failedToGetRunner * 0.25, 'red');

    return totalPoints;
}

function displayNetPoints(sectionId, points, color) {
    const section = document.querySelector(`.${sectionId}`);
    const title = section.querySelector('h2');
    title.innerHTML += `<span style="color: ${color};"> (${points >= 0 ? '+' : ''}${points.toFixed(2)})</span>`;
}

function displaySubPoints(sectionId, statId, value, color) {
    const section = document.querySelector(`.${sectionId}`);
    const subtitle = section.querySelector(`label[for="${statId}"]`);
    subtitle.innerHTML += `<span style="color: ${color};"> (${value >= 0 ? '+' : ''}${value.toFixed(2)})</span>`;
}

function clearDisplayedPoints(sectionId) {
    const section = document.querySelector(`.${sectionId}`);
    const titles = section.querySelectorAll('h2 span');
    titles.forEach(span => span.remove());

    const subtitles = section.querySelectorAll('label span');
    subtitles.forEach(span => span.remove());
}
