document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const slotsInfo = document.getElementById('slotsInfo');
    const signUpButton = document.getElementById('signUpButton');

    function fetchAvailableSlots() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const currentEntries = leaderboard.length;
        const maxSlots = 9;
        const availableSlots = maxSlots - currentEntries;
        localStorage.setItem('availableSlots', availableSlots);
        updateSlotsInfo(availableSlots, maxSlots);
        disableSignUpButtonIfFull(currentEntries, maxSlots);
    }

    function updateSlotsInfo(availableSlots, maxSlots) {
        slotsInfo.textContent = `Available slots: ${availableSlots} out of ${maxSlots}`;
    }

    function disableSignUpButtonIfFull(currentSlots, maxSlots) {
        if (currentSlots >= maxSlots) {
            signUpButton.disabled = true;
            signUpButton.textContent = 'Slots Full';
        }
    }

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const userName = document.getElementById('userName').value;
        const group = document.getElementById('group').value;
        const password = document.getElementById('password').value;

        // For prototype, we only handle Group 1
        if (group === '1' && password === 'password1') {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push({ userName, group });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('userName', userName);
            window.location.href = 'index.html';
        } else {
            alert('Incorrect password or group selection. Please try again.');
        }
    });

    // Fetch available slots on page load
    fetchAvailableSlots();
});
