import express from "express";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 3000;

app.get("/elo", async (req, res) => {
  try {
    const API_KEY = process.env.FACEIT_API_KEY;
    const nickname = "_-noX"; 

    // 1. Oyuncu Bilgilerini Çek (ELO ve ID için)
    const playerRes = await fetch(`https://open.faceit.com/data/v4/players?nickname=${nickname}&game=cs2`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    
    if (!playerRes.ok) return res.send("❌ Oyuncu bulunamadı.");
    const playerData = await playerRes.json();
    const playerId = playerData.player_id;
    const elo = playerData.games.cs2.faceit_elo;
    const level = playerData.games.cs2.skill_level;

    // 2. Son 5 Maçı Çek
    const historyRes = await fetch(`https://open.faceit.com/data/v4/players/${playerId}/history?game=cs2&limit=5`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    
    let matches = "";
    if (historyRes.ok) {
        const historyData = await historyRes.json();
        matches = historyData.items.map(m => {
            // Galibiyet/Mağlubiyet kontrolü (Basitleştirilmiş)
            // Not: Detaylı sonuç için her maçın detayına girmek gerekir, 
            // şimdilik maçların listesini (Harita bazlı) ekliyoruz.
            return m.competition_name.includes("Matchmaking") ? "🎮" : "🏆";
        }).join("");
    }

    res.send(`📊 ELO: ${elo} | Level: ${level} | Son 5: ${matches} | 🎮 Nick: ${nickname}`);
  } catch (error) {
    res.send("❌ Veri işlenirken bir hata oluştu.");
  }
});

app.listen(port, () => console.log(`Bot ${port} üzerinde çalışıyor.`));
