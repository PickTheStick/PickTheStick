document.addEventListener('DOMContentLoaded', function() {
    const divisionSelect = document.getElementById('division');
    const teamSelect = document.getElementById('team');
    const gameDateInput = document.getElementById('gameDate');

    const rosterURL = id => `https://statsapi.mlb.com/api/v1/teams/${id}/roster/40Man`;
    const imgURL = id => `https://midfield.mlbstatic.com/v1/people/${id}/headshot/100x100`;

    const projectedStarters = new Set([
        "Corbin Carroll", "Jake McCarthy", "Ketel Marte", "Eugenio Suárez",
        "Josh Naylor", "Lourdes Gurriel Jr.", "Gabriel Moreno", "Geraldo Perdomo",
        "Alek Thomas", "Lawrence Butler", "Brent Rooker", "JJ Bleday",
        "Shea Langeliers", "Mark Canha", "Tyler Soderstrom", "Zack Gelof",
        "Gio Urshela", "Jacob Wilson", "Michael Harris III", "Ozzie Albies",
        "Austin Riley", "Matt Olson", "Marcell Ozuna", "Jarred Kelenic",
        "Sean Murphy", "Bryan De La Cruz", "Orlando Arcia", "Cedric Mullins",
        "Adley Rutschman", "Gunnar Henderson", "Tyler O'Neill", "Ryan O'Hearn",
        "Ryan Mountcastle", "Colton Cowser", "Jordan Westburg", "Jackson Holliday",
        "Jarren Duran", "Rafael Devers", "Triston Casas", "Alex Verdugo",
        "Alex Bregman", "Wilyer Abreu", "Trevor Story", "Masataka Yoshida",
        "Connor Wong", "Ceddanne Rafaela", "Ian Happ", "Kyle Tucker",
        "Seiya Suzuki", "Michael Busch", "Dansby Swanson", "Nico Hoerner",
        "Pete Crow-Armstrong", "Matt Shaw", "Miguel Amaya", "Mike Tauchman",
        "Andrew Benintendi", "Luis Robert Jr.", "Andrew Vaughn", "Josh Rojas",
        "Amed Rosario", "Miguel Vargas", "Korey Lee", "Lenyn Sosa", "TJ Friedl",
        "Elly De La Cruz", "Matt McLain", "Spencer Steer", "Tyler Stephenson",
        "Jake Fraley", "Jeimer Candelario", "Christian Encarnacion-Strand",
        "Will Benson", "Steven Kwan", "Kyle Manzardo", "José Ramírez",
        "Carlos Santana", "Jhonkensy Noel", "Lane Thomas", "Bo Naylor",
        "Gabriel Arias", "Brayan Rocchio", "Brenton Doyle", "Ezequiel Tovar",
        "Ryan McMahon", "Kris Bryant", "Michael Toglia", "Nolan Jones",
        "Thairo Estrada", "Sam Hilliard", "Jacob Stallings", "Parker Meadows",
        "Gleyber Torres", "Riley Greene", "Kerry Carpenter", "Matt Vierling",
        "Colt Keith", "Jace Jung", "Trey Sweeney", "Jake Rogers",
        "Jose Altuve", "Yordan Alvarez", "Christian Walker", "Yainer Diaz",
        "Isaac Paredes", "Jeremy Peña", "Chas McCormick", "Taylor Trammell",
        "Jake Meyers", "Jonathan India", "Bobby Witt Jr.", "Vinnie Pasquantino",
        "Salvador Pérez", "Michael Massey", "Hunter Renfroe", "MJ Melendez",
        "Maikel García", "Kyle Isbel", "Nolan Schanuel", "Zach Neto",
        "Mike Trout", "Jorge Soler", "Logan O'Hoppe", "Taylor Ward",
        "Anthony Rendon", "Luis Rengifo", "Jo Adell", "Shohei Ohtani",
        "Mookie Betts", "Freddie Freeman", "Teoscar Hernández", "Will Smith",
        "Max Muncy", "Michael Conforto", "Tommy Edman", "Gavin Lux",
        "Xavier Edwards", "Connor Norby", "Jesús Sánchez", "Jonah Bride",
        "Ramón Laureano", "Deyvison De Los Santos", "Otto Lopez", "Kyle Stowers",
        "Nick Fortes", "Jackson Chourio", "Christian Yelich", "William Contreras",
        "Garrett Mitchell", "Rhys Hoskins", "Sal Frelick", "Paul DeJong",
        "Joey Ortiz", "Brice Turang", "Willi Castro", "Carlos Correa",
        "Royce Lewis", "Byron Buxton", "Trevor Larnach", "Matt Wallner",
        "José Miranda", "Ryan Jeffers", "Brooks Lee", "Francisco Lindor",
        "Juan Soto", "Mark Vientos", "Pete Alonso", "Brandon Nimmo",
        "Starling Marte", "Jeff McNeil", "Francisco Alvarez", "Tyrone Taylor",
        "Jazz Chisholm Jr.", "Aaron Judge", "Cody Bellinger", "Paul Goldschmidt",
        "Giancarlo Stanton", "Austin Wells", "Jason Dominguez", "Anthony Volpe",
        "Donovan Solano", "Kyle Schwarber", "Trea Turner", "Bryce Harper",
        "Alec Bohm", "Nick Castellanos", "Brandon Marsh", "J.T. Realmuto",
        "Max Kepler", "Bryson Stott", "Isiah Kiner-Falefa", "Bryan Reynolds",
        "Oneil Cruz", "Andrew McCutchen", "Joey Bart", "Austin Hays",
        "Spencer Horwitz", "Nick Gonzales", "Ke'Bryan Hayes", "Luis Arraez",
        "Jurickson Profar", "Fernando Tatis Jr.", "Manny Machado", "Jackson Merrill",
        "Xander Bogaerts", "Anthony Rizzo", "Jake Cronenworth", "Luis Campusano",
        "Jung Hoo Lee", "Willy Adames", "Matt Chapman", "Heliot Ramos",
        "Justin Turner", "Mike Yastrzemski", "LaMonte Wade Jr.", "Tyler Fitzgerald",
        "Patrick Bailey", "Ha-Seong Kim", "Julio Rodríguez", "Cal Raleigh",
        "J.D. Martinez", "Randy Arozarena", "Luke Raley", "Jose Iglesias",
        "J.P. Crawford", "Victor Robles", "Masyn Winn", "Brendan Donovan",
        "Willson Contreras", "Nolan Arenado", "Alec Burleson", "Lars Nootbaar",
        "Jordan Walker", "Iván Herrera", "Victor Scott II", "Yandy Díaz",
        "Josh Lowe", "Junior Caminero", "Brandon Lowe", "Christopher Morel",
        "Danny Jansen", "Eloy Jiménez", "Jonny DeLuca", "José Caballero",
        "Marcus Semien", "Corey Seager", "Wyatt Langford", "Joc Pederson",
        "Adolis Garcia", "Josh Jung", "Jake Burger", "Jonah Heim",
        "Evan Carter", "George Springer", "Jesse Winker", "Vladimir Guerrero Jr.",
        "Anthony Santander", "Bo Bichette", "Alejandro Kirk", "Ernie Clement",
        "Andrés Giménez", "Harrison Bader", "CJ Abrams", "Luis García Jr.",
        "James Wood", "Nathaniel Lowe", "Josh Bell", "Dylan Crews",
        "Keibert Ruiz", "Jorge Polanco", "Jacob Young"
    ]);
    
    const teamsByDivision = {
        "AL West": [
            { id: 117, name: "Houston Astros" },
            { id: 108, name: "Los Angeles Angels" },
            { id: 133, name: "Oakland Athletics" },
            { id: 136, name: "Seattle Mariners" },
            { id: 140, name: "Texas Rangers" }
        ],
        "AL East": [
            { id: 110, name: "Baltimore Orioles" },
            { id: 111, name: "Boston Red Sox" },
            { id: 147, name: "New York Yankees" },
            { id: 139, name: "Tampa Bay Rays" },
            { id: 141, name: "Toronto Blue Jays" }
        ],
        "AL Central": [
            { id: 145, name: "Chicago White Sox" },
            { id: 114, name: "Cleveland Indians" },
            { id: 116, name: "Detroit Tigers" },
            { id: 118, name: "Kansas City Royals" },
            { id: 142, name: "Minnesota Twins" }
        ],
        "NL West": [
            { id: 109, name: "Arizona Diamondbacks" },
            { id: 115, name: "Colorado Rockies" },
            { id: 119, name: "Los Angeles Dodgers" },
            { id: 135, name: "San Diego Padres" },
            { id: 137, name: "San Francisco Giants" }
        ],
        "NL East": [
            { id: 155, name: "Atlanta Braves" },
            { id: 146, name: "Miami Marlins" },
            { id: 121, name: "New York Mets" },
            { id: 143, name: "Philadelphia Phillies" },
            { id: 120, name: "Washington Nationals" }
        ],
        "NL Central": [
            { id: 112, name: "Chicago Cubs" },
            { id: 113, name: "Cincinnati Reds" },
            { id: 158, name: "Milwaukee Brewers" },
            { id: 134, name: "Pittsburgh Pirates" },
            { id: 138, name: "St. Louis Cardinals" }
        ]
        };

    // Update teams dropdown based on selected division
    divisionSelect.addEventListener('change', function() {
        const division = divisionSelect.value;
        const teams = teamsByDivision[division] || [];

        // Clear existing team options
        teamSelect.innerHTML = '<option value="">Select Team</option>';

        // Add new team options
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            teamSelect.appendChild(option);
        });
    });

    teamSelect.addEventListener('change', async function() {
        const teamId = this.value;
        if (teamId) {
            await loadRoster(teamId);
        }
    });

    async function loadRoster(teamId) {
        const res = await fetch(rosterURL(teamId));
        const data = await res.json();
        const roster = data.roster;
    
        // Clear the sections before appending new data
        const regularStartersDiv = document.getElementById("projected-regular-starters");
        const benchAnd40ManDiv = document.getElementById("projected-bench-and-40man");
        
        // Ensure section titles are in their own full-width containers
        regularStartersDiv.innerHTML = "<div class='section-title-wrapper'><div class='section-title'>2025 Projected Regular Starters</div></div>";
        benchAnd40ManDiv.innerHTML = "<div class='section-title-wrapper'><div class='section-title'>2025 Projected Bench/40-man</div></div>";
    
        // Add players to the respective sections
        roster.forEach(player => {
            // Skip pitchers (only include hitters)
            if (player.position.abbreviation === "P") return;
    
            const playerName = player.person.fullName;
            const playerId = player.person.id;
            const imgSrc = imgURL(playerId);
    
            // Create player element
            const playerDiv = document.createElement('div');
            playerDiv.classList.add('player');
    
            // Create name element
            const playerNameElement = document.createElement('div');
            playerNameElement.classList.add('player-name');
            playerNameElement.textContent = playerName;
    
            // Create image element
            const playerImg = document.createElement('img');
            playerImg.src = imgSrc;
            playerImg.alt = playerName;
            playerImg.dataset.id = playerId;  // Store player ID for selection
    
            // Append image and name
            playerDiv.appendChild(playerImg);
            playerDiv.appendChild(playerNameElement);
    
            // Append player below the section title
            if (projectedStarters.has(playerName)) {
                regularStartersDiv.appendChild(playerDiv);
            } else {
                benchAnd40ManDiv.appendChild(playerDiv);
            }
    
            // Add event listener to highlight the selected player
            playerImg.addEventListener('click', function() {
                const allPlayerImgs = document.querySelectorAll('#projected-regular-starters img, #projected-bench-and-40man img');
                allPlayerImgs.forEach(img => img.classList.remove('selected'));  // Remove previous highlights
                playerImg.classList.add('selected');  // Add highlight to clicked player
            });
        });
    }
    
    

    // Display today's date
    const today = new Date().toLocaleDateString();
    gameDateInput.value = today;
});

