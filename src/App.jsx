import { useState } from "react";
import HomeScreen from "./home";
import GameScreen from "./game";

export default function App() {
  const [start, setStart] = useState(false);
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState("scored");
  const [rounds, setRounds] = useState(null);

  function startGame({ username, mode, rounds }){
    setUsername(username);
    setMode(mode);
    setRounds(rounds)
    setStart(true);
  }

  if(start){
    return <GameScreen username={username} mode={mode} rounds={rounds} onBack={()=> setStart(false)}/>
  }
  else{
    return <HomeScreen onStart={startGame} />
  }
}