document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = document.getElementById('userName');
    const playerName = urlParams.get('playerName');
    const gameDate = urlParams.get('gameDate');
    const pointsString = urlParams.get('points');

    console.log('Points String:', pointsString);
    try {
        if (pointsString !== null) {
            const points = JSON.parse(pointsString);
            console.log('Points:', points);

            document.getElementById('userName').value = userName;
            document.getElementById('playerName').value = playerName;
            document.getElementById('gameDate').value = gameDate;

            const positivePoints = points.positivePoints || {};
            console.log('Positive Points:', positivePoints);
            for (const key in positivePoints) {
                if (positivePoints.hasOwnProperty(key)) {
                    console.log('Setting', key, 'to', positivePoints[key]);
                    document.getElementById(key).value = positivePoints[key];
                }
            }

            const neutralPoints = points.neutralPoints || {};
            console.log('Neutral Points:', neutralPoints);
            for (const key in neutralPoints) {
                if (neutralPoints.hasOwnProperty(key)) {
                    console.log('Setting', key, 'to', neutralPoints[key]);
                    document.getElementById(key).value = neutralPoints[key];
                }
            }

            const negativePoints = points.negativePoints || {};
            console.log('Negative Points:', negativePoints);
            for (const key in negativePoints) {
                if (negativePoints.hasOwnProperty(key)) {
                    console.log('Setting', key, 'to', negativePoints[key]);
                    document.getElementById(key).value = negativePoints[key];
                }
            }
        } else {
            console.log('Points String is null');
        }
    } catch (error) {
        console.error('Error parsing points:', error);
    }
});


    const statForm = document.getElementById('statForm');
    const resetButton = document.getElementById('resetButton');
    const submitButton = document.getElementById('submitButton');
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
            submitButton.style.display = 'inline-block';
        });

        document.getElementById('homeRun').addEventListener('input', function() {
            const homeRunValue = parseInt(this.value) || 0;
            const rbisInput = document.getElementById('rbis');
            const rbisValue = parseInt(rbisInput.value) || 0;
            const runsInput = document.getElementById('runs');
            const runsValue = parseInt(rbisInput.value) || 0;

            if (homeRunValue > 0 && rbisValue === 0) {
                rbisInput.value = homeRunValue;
            }
            if (homeRunValue > 0 && runsValue === 0) {
                runsInput.value = homeRunValue;
            }
        });
    // Add event listeners for Strike Outs, Grounded Into Double Plays, Runner In Scoring Position Left On Base, and Failed to get the runner in
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
                    // Decrease the number of outs by one if the value is decreased
                    outsInput.value = Math.max(parseInt(outsInput.value) - 1, 0);
                }
                // Update the data-old-value attribute with the new value
                this.setAttribute('data-old-value', increaseValue);
            });
        }
    });
}

    if (resetButton) {
        resetButton.addEventListener('click', function() {
            statForm.reset();
            document.getElementById('result').innerHTML = '';

            clearDisplayedPoints('positive-points');
            clearDisplayedPoints('negative-points');
            clearDisplayedPoints('neutral-points');

            calculateButton.style.display = 'inline-block';
            resetButton.style.display = 'none';
            submitButton.style.display = 'none';
        });
    }

    if (submitButton) {
        submitButton.addEventListener('click', function() {
            const totalPoints = parseFloat(document.getElementById('result').innerText.split('earned ')[1].split(' points')[0]);
            const resultDescription = document.getElementById('result').innerText.split('. ')[1];
            const leaderboardEntry = {  points: totalPoints, resultDescription: resultDescription };
    
            let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
            // Find the index of the existing entry
            const existingIndex = leaderboard.findIndex(entry => entry.name === playerName && entry.gameDate === gameDate);
    
            if (existingIndex !== -1) {
                // If entry exists, update it
                leaderboard[existingIndex] = leaderboardEntry;
            } else {
                // Otherwise, add it to the leaderboard
                leaderboard.push(leaderboardEntry);
            }
    
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            window.location.href = 'index.html';
        });
    }
    

    if (document.getElementById('leaderboardBody')) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        renderLeaderboard(leaderboard);
    }


function calculatePoints(walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs, outs, roe, strikeouts, caughtStealing, doublePlay, rispLob, failedToGetRunner) {
    let positivePoints = 0;
    let negativePoints = 0;
    let neutralPoints = 0;

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

    neutralPoints += roe * 0.0;
    neutralPoints += outs * 0.0;

    // Increment at-bats when player reached on error
    const atBats = single + double + triple + homeRun + roe + outs;

    const totalPoints = positivePoints - negativePoints;
    displayNetPoints('positive-points', positivePoints, 'green');
    displayNetPoints('negative-points', negativePoints, 'red');
    displayNetPoints('neutral-points', neutralPoints, 'gray');

    // Remove the subtraction of negativePoints from totalPoints
    return totalPoints;
}

function generateResultDescription(walks, single, double, triple, homeRun, SB, sacrifice, rbis, runs, outs, roe, strikeouts, caughtStealing, doublePlay, rispLob, failedToGetRunner) {
    const hits = single + double + triple + homeRun;
    // Calculate at-bats including reached on error
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

    const neutralResults = [];
    if (roe > 0) neutralResults.push(`${roe} ROE${roe > 1 ? 's' : ''}`)
    if (outs > 0) neutralResults.push(`${outs} out${outs > 1 ? 's' : ''}`);

    const negativePoints = (strikeouts * 1) + (caughtStealing * 1) + (doublePlay * 1) + (rispLob * 0.5) + (failedToGetRunner * 2);
    return `${hits}/${atBats} (${results.join(', ')}) [ -${negativePoints.toFixed(2)} (${negativeResults.join(', ')})]`;
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
        const points = entry.points.toFixed(2);
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.user}</td>
            <td>${entry.name}</td>
            <td class="points-cell">${points}</td>
            <td>${entry.gameDate}</td>
            <td>
                <button class="editButton">Edit</button>
                <button class="deleteButton">Delete</button>
            </td>
        `;

        // Set background color based on points
        const pointsCell = row.querySelector('.points-cell');
        if (entry.points >= 6.0) {
            pointsCell.style.backgroundColor = 'darkgreen';
        } else if (entry.points >= 0.00) {
            pointsCell.style.backgroundColor = 'lightgreen';
        } else if (entry.points >= -3.00 && entry.points < 0.00) {
            pointsCell.style.backgroundColor = 'lightcoral';
        } else {
            pointsCell.style.backgroundColor = 'darkred';
        }

        const detailsRow = document.createElement('tr');
        detailsRow.classList.add('details-row');
        detailsRow.innerHTML = `
            <td colspan="6">${entry.resultDescription}</td>
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
            const entry = leaderboard[index];
            const userName = encodeURIComponent(entry.user);
            const playerName = encodeURIComponent(entry.name);
            const gameDate = encodeURIComponent(entry.gameDate);
        
            // Assuming entry.points contains the total points and not the breakdown
            // You should pass the detailed points breakdown here as well
            const detailedPoints = {
                positivePoints: entry.positivePoints,
                neutralPoints: entry.neutralPoints,
                negativePoints: entry.negativePoints
            };
            const points = encodeURIComponent(JSON.stringify(detailedPoints));
        
            // Navigate to the edit page with entry details as URL parameters
            window.location.href = `editForm.html?playerName=${playerName}&userName=${userName}&gameDate=${gameDate}&points=${points}`;
        });

        deleteButton.addEventListener('click', function(event) {
            event.stopPropagation();
            const confirmDelete = confirm("Are you sure you want to delete this?");
            if (confirmDelete) {
                let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
                leaderboard.splice(index, 1);
                localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
                // Remove the deleted row directly from the DOM
                row.remove();
                // If you have a details row, remove it as well
                detailsRow.remove();
            } else {
                alert("Deletion canceled!");
            }
        });
        tbody.appendChild(row);
        tbody.appendChild(detailsRow);
    });
}

