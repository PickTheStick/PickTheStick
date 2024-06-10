document.addEventListener('DOMContentLoaded', function() {
    // Auto-populate the date field with the current date
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

            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `<p>${playerName} earned ${totalPoints.toFixed(2)} points on ${gameDate}.</p>`;

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
            const leaderboardEntry = { name: playerName, points: totalPoints, gameDate: gameDate };

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
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const playerNameInput = document.getElementById('playerName');
    const gameDateInput = document.getElementById('gameDate');
    const pointsInput = document.getElementById('points');

    if (playerNameInput && urlParams.has('playerName')) {
        playerNameInput.value = urlParams.get('playerName');
    }
    if (gameDateInput && urlParams.has('gameDate')) {
        gameDateInput.value = urlParams.get('gameDate');
    }
    if (pointsInput && urlParams.has('points')) {
        pointsInput.value = urlParams.get('points');
    }

    if (document.getElementById('leaderboardBody')) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        renderLeaderboard(leaderboard);
    }
});

function renderLeaderboard(leaderboard) {
    leaderboard.sort((a, b) => b.points - a.points); // Sort the leaderboard based on points in descending order
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.points.toFixed(2)}</td>
            <td>${entry.gameDate}</td>
            <td>
                <button class="editButton" onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            </td>
        `;
        leaderboardBody.appendChild(row);
    });
}

function editEntry(index) {
    const password = prompt("Please enter the password:", "");
    if (password === "pp") {
        const entry = JSON.parse(localStorage.getItem('leaderboard'))[index];
        // Navigate to the edit page with autofilled answers
        window.location.href = `editForm.html?playerName=${entry.name}&gameDate=${entry.gameDate}&points=${entry.points}`;
    } else {
        alert("Incorrect password!");
    }
}
function deleteEntry(index) {
    const password = prompt("Please enter the password:", "");
    if (password === "pp") {
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.splice(index, 1);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        renderLeaderboard(leaderboard);
    } else {
        alert("Incorrect password!");
    }
}
