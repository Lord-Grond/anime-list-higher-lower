import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 3001;
const CLIENT_ID = "6e3d2b5d4d01638a7a8f2330c1d93f0e";

app.use(cors());

app.get("/api/anime/:username", async (req, res) => {
  const { username } = req.params;

  let next = `https://api.myanimelist.net/v2/users/${username}/animelist?limit=100&fields=list_status,anime{title,main_picture}`;
  let anime = [];

  try {
    while (next) {
      const response = await axios.get(next, {
        headers: {
          "X-MAL-Client-ID": CLIENT_ID,
        },
      });

      const data = response.data.data.map((item) => ({
        title: item.node.title,
        image: item.node.main_picture?.large,
        score: item.list_status?.score || 0,
      }));

      anime = anime.concat(data.filter((a) => a.score > 0));
      next = response.data.paging?.next || null;
    }

    console.log(`Total Anime Retrieved for ${username}:`, anime.length);

    res.json(anime);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch from MAL API" });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));
