document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in yyyy-mm-dd format
    const gameDateInput = document.getElementById('gameDate');
    if (gameDateInput) {
        gameDateInput.value = currentDate;
    }

    const statForm = document.getElementById('statForm');
    const resetButton = document.getElementById('resetButton');
    const submitButton = document.getElementById('submitButton');
    const calculateButton = document.getElementById('calculateButton');

    if (statForm) {
        statForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const playerName = document.getElementById('playerName').value;
            const gameDate = document.getElementById('gameDate').value;

            const walks = parseInt(document.getElementById('walks').value) || 0;
            const single = parseInt(document.getElementById('single').value) || 0;
            const double = parseInt(document.getElementById('double').value) || 0;
            const triple = parseInt(document.getElementById('triple').value) || 0;
            const homeRun = parseInt(document.getElementById('homeRun').value) || 0;
            const sacrifice = parseInt(document.getElementById('sacrifice').value) || 0;
            const rbis = parseInt(document.getElementById('rbis').value) || 0;
            const stolenBases = parseInt(document.getElementById('stolenBases').value) || 0;

            const outs = parseInt(document.getElementById('outs').value) || 0;
            const doublePlay = parseInt(document.getElementById('doublePlay').value) || 0;
            const leftOnBase = parseInt(document.getElementById('leftOnBase').value) || 0;
            const failedToGetRunner = parseInt(document.getElementById('failedToGetRunner').value) || 0;

            const totalPoints = calculatePoints(walks, single, double, triple, homeRun, sacrifice, rbis, stolenBases, outs, doublePlay, leftOnBase, failedToGetRunner);
            const resultDescription = generateResultDescription(walks, single, double, triple, homeRun, sacrifice, rbis, stolenBases, outs, doublePlay, leftOnBase, failedToGetRunner);

            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `<p>${playerName} earned ${totalPoints.toFixed(2)} points on ${gameDate}. ${resultDescription}</p>`;

            calculateButton.style.display = 'none';
            resetButton.style.display = 'inline-block';
            submitButton.style.display = 'inline-block';
        });

        document.getElementById('homeRun').addEventListener('input', function() {
            const homeRunValue = parseInt(this.value) || 0;
            const rbisInput = document.getElementById('rbis');
            const rbisValue = parseInt(rbisInput.value) || 0;

            if (homeRunValue > 0 && rbisValue === 0) {
                rbisInput.value = homeRunValue;
            }
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', function() {
            statForm.reset();
            document.getElementById('result').innerHTML = '';

            clearDisplayedPoints('positive-points');
            clearDisplayedPoints('negative-points');

            calculateButton.style.display = 'inline-block';
            resetButton.style.display = 'none';
            submitButton.style.display = 'none';
        });
    }

    if (submitButton) {
        submitButton.addEventListener('click', function() {
            const playerName = document.getElementById('playerName').value;
            const gameDate = document.getElementById('gameDate').value; // Get the game date
            const totalPoints = parseFloat(document.getElementById('result').innerText.split('earned ')[1].split(' points')[0]);
            const resultDescription = document.getElementById('result').innerText.split('. ')[1];
            const leaderboardEntry = { name: playerName, points: totalPoints, gameDate: gameDate, resultDescription: resultDescription };

            let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
            leaderboard.push(leaderboardEntry);
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            window.location.href = 'index.html';
        });
    }

    if (document.getElementById('leaderboardBody')) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        renderLeaderboard(leaderboard);
    }
});

function calculatePoints(walks, single, double, triple, homeRun, sacrifice, rbis, stolenBases, outs, doublePlay, leftOnBase, failedToGetRunner) {
    let positivePoints = 0;
    let negativePoints = 0;

    positivePoints += walks * 0.25;
    positivePoints += single * 0.5;
    positivePoints += double * 0.6;
    positivePoints += triple * 0.7;
    positivePoints += homeRun * 0.5;
    positivePoints += sacrifice * 0.25;
    positivePoints += rbis * 0.3;
    positivePoints += stolenBases * 0.5;

    negativePoints += outs * 0.1;
    negativePoints += doublePlay * 0.25;
    negativePoints += leftOnBase * 0.15;
    negativePoints += failedToGetRunner * 0.25;

    const totalPoints = positivePoints - negativePoints;
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

function generateResultDescription(walks, single, double, triple, homeRun, sacrifice, rbis, stolenBases, outs, doublePlay, leftOnBase, failedToGetRunner) {
    const hits = single + double + triple + homeRun;
    const atBats = hits + outs;
    const results = [];

    if (walks > 0) results.push(`${walks} BB/HBP`);
    if (single > 0) results.push(`${single} single${single > 1 ? 's' : ''}`);
    if (double > 0) results.push(`${double} double${double > 1 ? 's' : ''}`);
    if (triple > 0) results.push(`${triple} triple${triple > 1 ? 's' : ''}`);
    if (homeRun > 0) results.push(`${homeRun} HR`);
    if (sacrifice > 0) results.push(`${sacrifice} SAC`);
    if (rbis > 0) results.push(`${rbis} RBI's`);
    if (stolenBases > 0) results.push(`${stolenBases} SB`);

    const negativePoints = (outs * 0.1) + (doublePlay * 0.25) + (leftOnBase * 0.15) + (failedToGetRunner * 0.25);
    return `"${hits}/${atBats} (${results.join(', ')}) [points subtracted = ${negativePoints.toFixed(2)}]"`;
}

function displayNetPoints(sectionId, points, color) {
    const section = document.querySelector(`.${sectionId}`);
    const title = section.querySelector('h2');
    title.innerHTML += `<span style="color: ${color};"> (${points >= 0 ? '+' : ''}${points.toFixed(2)})</span>`;
}

function displaySubPoints(sectionId, statId, value, color) {
    const section = document.querySelector(`.${sectionId}`);
    const subtitle = section.querySelector(`label[for="${statId}"]`);
    subtitle.innerHTML += `<span style="color: ${color};"> (${value.toFixed(2)})</span>`;
}

function clearDisplayedPoints(sectionId) {
    const section = document.querySelector(`.${sectionId}`);
    const title = section.querySelector('h2');
    title.innerHTML = title.innerHTML.split(' ')[0];

    const labels = section.querySelectorAll('label');
    labels.forEach(label => {
        label.innerHTML = label.innerHTML.split(' ')[0];
    });
}

function renderLeaderboard(leaderboard) {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    leaderboard.sort((a, b) => b.points - a.points);

    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.points.toFixed(2)}</td>
            <td>${entry.gameDate}</td>
            <td>
                <button class="editButton">Edit</button>
                <button class="deleteButton">Delete</button>
            </td>
        `;

        const detailsRow = document.createElement('tr');
        detailsRow.classList.add('details-row');
        detailsRow.innerHTML = `
            <td colspan="5">${entry.resultDescription}</td>
        `;

        row.addEventListener('click', function() {
            if (detailsRow.style.display === 'none' || !detailsRow.style.display) {
                detailsRow.style.display = 'table-row';
            } else {
                detailsRow.style.display = 'none';
            }
        });

        const editButton = row.querySelector('.editButton');
        const deleteButton = row.querySelector('.deleteButton');

        editButton.addEventListener('click', function(event) {
            event.stopPropagation();
            const password = prompt("Please enter the password:", "");
            if (password === "pp") {
                const entry = JSON.parse(localStorage.getItem('leaderboard'))[index];
                // Navigate to the edit page with autofilled answers
                window.location.href = `editForm.html?playerName=${entry.name}&gameDate=${entry.gameDate}&points=${entry.points}`;
            } else {
                alert("Incorrect password!");
            }
        });

        deleteButton.addEventListener('click', function(event) {
            event.stopPropagation();
            const password = prompt("Please enter the password:", "");
            if (password === "pp") {
                let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
                leaderboard.splice(index, 1);
                localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
                renderLeaderboard(leaderboard);
            } else {
                alert("Incorrect password!");
            }        });

        tbody.appendChild(row);
        tbody.appendChild(detailsRow);
    });
}
