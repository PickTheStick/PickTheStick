document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('userName');
    if (!user) {
        window.location.href = 'signup.html';
    } else {
        document.getElementById('user').value = user;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById('gameDate').value = formattedDate;

    document.getElementById('navigateToLeaderboard').addEventListener('click', function() {
        window.location.href = 'leaderboard.html';
    });

    updateUserList();

    const pickTheStickButton = document.getElementById('pickTheStickButton');
    const turnOffPicksButton = document.getElementById('turnOffPicks');
    const turnOnPicksButton = document.getElementById('turnOnPicks');
    const adminPassword = 'boobs'; // Replace with actual secure logic

    pickTheStickButton.addEventListener('click', function() {
        const user = document.getElementById('user').value;
        const playerElement = document.getElementById('player');
        const player = playerElement.value;
        const playerName = playerElement.options[playerElement.selectedIndex].text;

        if (user && player) {
            const picksEnabled = localStorage.getItem('picksEnabled');
            if (picksEnabled === 'false') {
                alert('It is past time to pick the stick. Picks are currently disabled.');
                return;
            }

            const lastPickDate = localStorage.getItem(`${user}_lastPickDate`);
            const currentDate = formattedDate;

            if (lastPickDate === currentDate) {
                alert('You have already made a pick today.');
                return;
            }

            localStorage.setItem(`${user}_lastPickDate`, currentDate);
            localStorage.setItem('selectedPlayer', JSON.stringify({ user, playerName, gameDate: formattedDate }));
            window.location.href = 'leaderboard.html';
        } else {
            alert('Please fill in all fields.');
        }
    });

    turnOffPicksButton.addEventListener('click', function() {
        const password = prompt('Enter admin password:');
        if (password === adminPassword) {
            localStorage.setItem('picksEnabled', 'false');
            alert('Picks turned off.');
        } else {
            alert('Incorrect password.');
        }
    });

    turnOnPicksButton.addEventListener('click', function() {
        const password = prompt('Enter admin password:');
        if (password === adminPassword) {
            localStorage.setItem('picksEnabled', 'true');
            alert('Picks turned on.');
        } else {
            alert('Incorrect password.');
        }
    });
});

function updateUserList() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // Clear existing list

    // Add users from the leaderboard to the userList
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry.user;
        userList.appendChild(li);
    });
}

function deleteUser(userName) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    const updatedLeaderboard = leaderboard.filter(entry => entry.user !== userName);

    localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));

    updateUserList();
}
