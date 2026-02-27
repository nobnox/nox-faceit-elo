import express from "express";
import fetch from "node-fetch";

const app = express();

const API_KEY = process.env.FACEIT_API_KEY;
const PLAYER_ID = process.env.PLAYER_ID;

app.get("/elo", async (req, res) => {
  try {
    // 1. Güncel ELO ve Seviye Bilgisini Al
    const playerRes = await fetch(`https://open.faceit.com/data/v4/players/${PLAYER_ID}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const playerData = await playerRes.json();
    const currentElo = playerData.games.cs2.faceit_elo;
    const level = playerData.games.cs2.skill_level;

    // 2. Son Maçlardaki ELO Değişimini Hesapla (Bugün/Son Maçlar)
    const historyRes = await fetch(`https://open.faceit.com/data/v4/players/${PLAYER_ID}/history?game=cs2&limit=1`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const historyData = await historyRes.json();
    
    // Not: Faceit API anlık "bugün +25" vermez, ancak son maç verisiyle kıyaslama yapılabilir.
    // Şimdilik en temiz haliyle ELO ve Level yazdıralım:
    
    res.send(`📊 ELO: ${currentElo} | Level: ${level} | 🎮 Nick: ${playerData.nickname}`);

  } catch (error) {
    console.error(error);
    res.send("Faceit verisi şu an alınamadı, API anahtarını veya Player ID'yi kontrol et.");
  }
});

app.listen(3000, () => console.log("Bot hazır!"));
