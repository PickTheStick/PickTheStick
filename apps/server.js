const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/player-performance', async (req, res) => {
    const { playerName, gameDate } = req.query;

    try {
        // Format the date to match Baseball-Reference URL structure (YYYYMMDD)
        const formattedDate = gameDate.replace(/-/g, '');

        // Search for the player on Baseball-Reference
        const searchUrl = `https://www.baseball-reference.com/search/search.fcgi?search=${playerName}`;
        const searchResponse = await axios.get(searchUrl);
        const $search = cheerio.load(searchResponse.data);

        // Extract the player's profile URL from the search results
        const playerProfileUrl = $search('div.search-item-url').first().text();
        if (!playerProfileUrl) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // Visit the player's game log page for the specified year
        const year = gameDate.split('-')[0];
        const gameLogUrl = `https://www.baseball-reference.com${playerProfileUrl.replace('.shtml', '')}/gamelog/${year}`;
        const gameLogResponse = await axios.get(gameLogUrl);
        const $gameLog = cheerio.load(gameLogResponse.data);

        // Extract performance data for the specified date
        const gameData = [];
        $gameLog('tr').each((index, element) => {
            const date = $gameLog(element).find('td[data-stat="date_game"]').text().trim();
            if (date.includes(formattedDate)) {
                $gameLog(element).find('td').each((i, el) => {
                    gameData.push($gameLog(el).text().trim());
                });
            }
        });

        if (gameData.length === 0) {
            return res.status(404).json({ error: 'No game data found for the specified date' });
        }

        res.json({ gameData });
    } catch (error) {
        console.error('Error fetching player performance:', error);
        res.status(500).json({ error: 'Failed to fetch player performance' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
