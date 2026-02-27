import express from "express";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 3000;

app.get("/elo", async (req, res) => {
  try {
    const API_KEY = process.env.FACEIT_API_KEY;
    // PLAYER_ID yerine direkt kullanıcı adını buraya yazıyoruz ki hata payı kalmasın
    const nickname = "_-noX"; 

    const response = await fetch(`https://open.faceit.com/data/v4/players?nickname=${nickname}&game=cs2`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        return res.send(`Faceit Hatası: ${errorData.errors[0].message}`);
    }
    
    const data = await response.json();
    const elo = data.games.cs2.faceit_elo;
    const level = data.games.cs2.skill_level;

    res.send(`📊 ELO: ${elo} | Level: ${level} | 🎮 Nick: ${nickname}`);
  } catch (error) {
    res.send("❌ Sistemsel bir hata oluştu.");
  }
});

app.listen(port, () => console.log(`Bot ${port} üzerinde çalışıyor.`));
