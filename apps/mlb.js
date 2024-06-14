document.addEventListener('DOMContentLoaded', function() {
    const divisionSelect = document.getElementById('division');
    const teamSelect = document.getElementById('team');
    const playerSelect = document.getElementById('player');
    const gameDateInput = document.getElementById('gameDate');

    const teams = {
        "AL West": ["Seattle Mariners", "Texas Rangers", "Houston Astros", "Oakland Athletics", "Los Angeles Angels"],
        "AL East": ["New York Yankees", "Baltimore Orioles", "Boston Red Sox", "Toronto Blue Jays", "Tampa Bay Rays"],
        "AL Central": ["Cleveland Guardians", "Kansas City Royals", "Minnesota Twins", "Detroit Tigers", "Chicago White Sox"],
        "NL East": ["Atlanta Braves", "Philadelphia Phillies", "Washington Nationals", "New York Mets", "Miami Marlins"],
        "NL Central": ["Milwaukee Brewers", "Chicago Cubs", "Cincinnati Reds", "St. Louis Cardinals", "Pittsburgh Pirates"],
        "NL West": ["Colorado Rockies", "Los Angeles Dodgers", "Arizona Diamondbacks", "San Diego Padres", "San Francisco Giants"]
    };

    function populateTeamDropdown() {
        teamSelect.innerHTML = '<option value="">Select Team</option>';
        const selectedDivision = divisionSelect.value;
        if (selectedDivision === 'All') {
            Object.keys(teams).forEach(division => {
                teams[division].forEach(team => {
                    const option = document.createElement('option');
                    option.value = team;
                    option.textContent = team;
                    teamSelect.appendChild(option);
                });
            });
        } else {
            teams[selectedDivision].forEach(team => {
                const option = document.createElement('option');
                option.value = team;
                option.textContent = team;
                teamSelect.appendChild(option);
            });
        }
    }

    function populatePlayerDropdown(teamName) {
        const teamId = getTeamId(teamName);
        if (!teamId) {
            console.error('Team ID not found for', teamName);
            return;
        }

        const apiUrl = `https://lookup-service-prod.mlb.com/json/named.roster_40.bam?team_id=${teamId}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const playerSelect = document.getElementById('player');
                playerSelect.innerHTML = '<option value="">Select Player</option>';
                const roster = data.roster_40.queryResults.row;

                // Filter out pitchers, including a special case for Shohei Ohtani
                if (Array.isArray(roster)) {
                    roster.forEach(player => {
                        if (!player.position_txt || !player.position_txt.includes('P') || player.name_display_first_last === 'Shohei Ohtani') {
                            const option = document.createElement('option');
                            option.value = player.player_id;
                            option.textContent = player.name_display_first_last;
                            playerSelect.appendChild(option);
                        }
                    });
                } else {
                    if (!roster.position_txt || !roster.position_txt.includes('P') || roster.name_display_first_last === 'Shohei Ohtani') {
                        const option = document.createElement('option');
                        option.value = roster.player_id;
                        option.textContent = roster.name_display_first_last;
                        playerSelect.appendChild(option);
                    }
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    function getTeamId(teamName) {
        const teamIds = {
            "Seattle Mariners": 136,
            "Texas Rangers": 140,
            "Houston Astros": 117,
            "Oakland Athletics": 133,
            "Los Angeles Angels": 108,
            "New York Yankees": 147,
            "Baltimore Orioles": 110,
            "Boston Red Sox": 111,
            "Toronto Blue Jays": 141,
            "Tampa Bay Rays": 139,
            "Cleveland Guardians": 114,
            "Kansas City Royals": 118,
            "Minnesota Twins": 142,
            "Detroit Tigers": 116,
            "Chicago White Sox": 145,
            "Atlanta Braves": 144,
            "Philadelphia Phillies": 143,
            "Washington Nationals": 120,
            "New York Mets": 121,
            "Miami Marlins": 146,
            "Milwaukee Brewers": 158,
            "Chicago Cubs": 112,
            "Cincinnati Reds": 113,
            "St. Louis Cardinals": 138,
            "Pittsburgh Pirates": 134,
            "Colorado Rockies": 115,
            "Los Angeles Dodgers": 119,
            "Arizona Diamondbacks": 109,
            "San Diego Padres": 135,
            "San Francisco Giants": 137
        };

        return teamIds[teamName];
    }
    divisionSelect.addEventListener('change', populateTeamDropdown);
    teamSelect.addEventListener('change', function() {
        const selectedTeam = teamSelect.value;
        populatePlayerDropdown(selectedTeam);
    });

    populateTeamDropdown(); // Initial population of teams
});
