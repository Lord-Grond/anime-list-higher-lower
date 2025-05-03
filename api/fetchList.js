export default async function handler(req, res) {
    const username = req.query.username;
    const cid = process.env.MAL_CLIENT_ID;
  
    if (!username || !cid) {
      return res.status(400).json({ error: "Missing username or MAL client ID" });
    }
  
    let next = `https://api.myanimelist.net/v2/users/${username}/animelist?limit=100&fields=list_status,main_picture`;
    let anime = [];
  
    try {
      while (next) {
        const response = await fetch(next, {
          headers: { 'X-MAL-Client-ID': cid }
        });
  
        if (!response.ok) {
          return res.status(response.status).json({ error: "MAL API error" });
        }
  
        const data = await response.json();
  
        const extracted = data.data.map(a => ({
          title: a.node.title,
          image: a.node.main_picture?.medium,
          score: a.list_status?.score || 0
        })).filter(a => a.score > 0);
  
        anime = anime.concat(extracted);
        next = data.paging?.next || null;
      }
  
      return res.status(200).json(anime);
    } catch (e) {
      return res.status(500).json({ error: "Server error" });
    }
  }