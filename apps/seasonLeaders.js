document.addEventListener('DOMContentLoaded', function() {
    const refreshSeasonLeaderboardButton = document.getElementById('refreshSeasonLeaderboard');
    if (refreshSeasonLeaderboardButton) {
        refreshSeasonLeaderboardButton.addEventListener('click', () => {
            const downloadedLeaderboard = JSON.parse(localStorage.getItem('downloadedLeaderboard')) || [];
            const seasonLeaderboard = mergeLeaderboardData(downloadedLeaderboard);
            localStorage.setItem('seasonLeaderboard', JSON.stringify(seasonLeaderboard));
            renderSeasonLeaderboard(seasonLeaderboard);
        });
    }

    const clearSeasonLeaderboardButton = document.getElementById('clearSeasonLeaderboard');
    if (clearSeasonLeaderboardButton) {
        clearSeasonLeaderboardButton.addEventListener('click', () => {
            localStorage.removeItem('seasonLeaderboard');
            renderSeasonLeaderboard({});
        });
    }

    const storedSeasonLeaderboard = JSON.parse(localStorage.getItem('seasonLeaderboard')) || [];
    renderSeasonLeaderboard(storedSeasonLeaderboard);
});

function mergeLeaderboardData(downloadedLeaderboard) {
    const seasonLeaderboard = JSON.parse(localStorage.getItem('seasonLeaderboard')) || {};

    downloadedLeaderboard.forEach(entry => {
        const user = entry.user;
        if (!seasonLeaderboard[user]) {
            seasonLeaderboard[user] = {
                points: 0,
                playersUsed: []
            };
        }
        seasonLeaderboard[user].points += entry.points;
        seasonLeaderboard[user].playersUsed.push(entry.name);
    });

    return seasonLeaderboard;
}

function renderSeasonLeaderboard(seasonLeaderboard) {
    const tbody = document.getElementById('seasonLeaderboardBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const sortedLeaderboard = Object.entries(seasonLeaderboard).sort((a, b) => b[1].points - a[1].points);
    sortedLeaderboard.forEach(([user, data], index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user}</td>
            <td>${data.points}</td>
            <td>${data.playersUsed.join(', ')}</td>
        `;
        tbody.appendChild(row);
    });
}
