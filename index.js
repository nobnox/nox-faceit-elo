import express from "express";
import fetch from "node-fetch";

const app = express();

const API_KEY = process.env.FACEIT_API_KEY;
const PLAYER_ID = process.env.PLAYER_ID;

app.get("/elo", async (req, res) => {
  try {
    const response = await fetch(
      `https://open.faceit.com/data/v4/players/${PLAYER_ID}/history?game=cs2&limit=5`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );

    const data = await response.json();

    let wins = 0;
    let losses = 0;

    data.items.forEach((match) => {
      const isWin = match.results.winner === match.teams.faction1.faction_id;
      if (isWin) wins++;
      else losses++;
    });

    res.send(`🔥 Son 5 maç: ${wins}W - ${losses}L | Nox grind devam ediyor 💀`);
  } catch (error) {
    res.send("ELO verisi alınamadı.");
  }
});

app.listen(3000);
