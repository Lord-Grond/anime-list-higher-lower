
export async function fetchList(username) {
  try {
    const response = await fetch(`/api/fetchList?username=${username}`);
    if(!response.ok){
      if(response.status === 404){
        throw new Error("User not found");
      }
      throw new Error("Failed to load anime list");
    }
    
    const anime = await response.json();
    return anime;
  }
  catch (e){
    throw e;
  }
}