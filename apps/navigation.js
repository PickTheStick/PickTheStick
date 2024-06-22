document.addEventListener('DOMContentLoaded', function() {
    const navigateToSearchButton = document.getElementById('navigateToSearch');
    if (navigateToSearchButton) {
        navigateToSearchButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    const navigateToSeasonLeaderboardButton = document.getElementById('navigateToSeasonLeaderboard');
    if (navigateToSeasonLeaderboardButton) {
        navigateToSeasonLeaderboardButton.addEventListener('click', () => {
            window.location.href = 'seasonLeaders.html';
        });
    }
    const navigateToFormThreeButton = document.getElementById('navigateToFormThree');
    if (navigateToFormThreeButton) {
        navigateToFormThreeButton.addEventListener('click', () => {
            window.location.href = 'calcForm.html';
        });
    }
});
