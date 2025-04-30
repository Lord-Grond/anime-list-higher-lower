import axios from "axios";

export async function fetchList(username) {
  const response = await axios.get(`http://localhost:3001/api/anime/${username}`);
  return response.data;
}