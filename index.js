import express from "express";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 3000;

const API_KEY = process.env.FACEIT_API_KEY;
const PLAYER_ID = process.env.PLAYER_ID;

app.get("/elo", async (req, res) => {
  try {
    const response = await fetch(`https://open.faceit.com/data/v4/players/${PLAYER_ID}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    
    if (!response.ok) throw new Error("API Hatası");
    
    const data = await response.json();
    const elo = data.games.cs2.faceit_elo;
    const level = data.games.cs2.skill_level;
    const nick = data.nickname;

    res.send(`📊 ELO: ${elo} | Level: ${level} | 🎮 Nick: ${nick}`);
  } catch (error) {
    res.send("❌ Veri alınamadı. Anahtar veya ID hatalı.");
  }
});

app.listen(port, () => console.log(`Bot ${port} üzerinde çalışıyor.`));
