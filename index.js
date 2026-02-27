import express from "express";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 3000;

app.get("/elo", async (req, res) => {
  try {
    const API_KEY = process.env.FACEIT_API_KEY;
    const nickname = "_-noX"; 

    const playerRes = await fetch(`https://open.faceit.com/data/v4/players?nickname=${nickname}&game=cs2`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    
    if (!playerRes.ok) return res.send("❌ Oyuncu bulunamadı.");
    const playerData = await playerRes.json();
    const playerId = playerData.player_id;
    const elo = playerData.games.cs2.faceit_elo;
    const level = playerData.games.cs2.skill_level;

    const historyRes = await fetch(`https://open.faceit.com/data/v4/players/${playerId}/history?game=cs2&limit=5`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    
    let matchResults = "";
    if (historyRes.ok) {
        const historyData = await historyRes.json();
        
        const results = historyData.items.map(match => {
            const teamA = match.results.score["faction1"];
            const teamB = match.results.score["faction2"];
            const winner = teamA > teamB ? "faction1" : "faction2";
            const playerTeam = match.teams.faction1.players.some(p => p.player_id === playerId) ? "faction1" : "faction2";
            return playerTeam === winner ? "W" : "L";
        });
        
        // .reverse() ekledim, böylece en son maçın EN BAŞTA görünecek (WLLLL gibi)
        matchResults = results.reverse().join(""); 
    }

    res.send(`📊 ELO: ${elo} | Level: ${level} | Son 5: ${matchResults} | 🎮 Nick: ${nickname}`);
  } catch (error) {
    res.send("❌ Veri alınırken bir hata oluştu.");
  }
});

app.listen(port, () => console.log(`Bot ${port} üzerinde çalışıyor.`));
