import { useEffect, useState } from "react";
import { fetchList } from './fetchList';


export default function GameScreen({ username, mode, rounds, onBack}){
    const [animeList, setAL] = useState([]);
    const [ogList, setogL] = useState([]);
    const [currentPair, setP] = useState([null, null]);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [loading, setL] = useState(true);
    const [gameOver, owarida] = useState(false);
    const [error, setError] = useState(null);
    const [wholeList, setWholeList] = useState(mode === "scored" && rounds === 0);

    useEffect(() => {
      async function load(){
        //await wait(3000);
        fetchList(username)
          .then((list) => {
            if(list.length < 2 || (mode === "scored" && list.length < rounds - 1)){
              setError("Not enough scored anime to play.");
              return;
            }

            const cute = list[Math.floor(Math.random() * list.length)];
            let funny;
            do {
              funny = list[Math.floor(Math.random() * list.length)];
            } while (cute.title === funny.title);
      
            setP([cute, funny]);
      
            let newList = list;
            if (mode === "scored") {
              newList = list.filter(anime => anime.title !== cute.title && anime.title !== funny.title);
            }
            setAL(newList);
            setogL(list);
            
          })
          .catch(() => {
            setError("Failed to fetch user list. Please check username.");
          })
          .finally(() => {
            setL(false);
          });
      }
      load();
    }, [username]);



    function handleGuess(guess){
        const [a, b] = currentPair;
        let correct = false;
        if(guess === "higher" && b.score > a.score){
          correct = true;
        }
        else if(guess === "lower" && b.score < a.score){
          correct = true;
        }
        else if(guess === "same" && b.score === a.score){
          correct = true;
        }
        else{
          correct = false;
        }
        
    
        if(mode === "scored"){
          if(correct){
            setScore(score + 1);
          }
          const nr = round + 1;
          if((wholeList && nr >= ogList.length - 1) || (!wholeList && nr >= rounds)){
            owarida(true);
            return;
          }
          setRound(nr);
          const newList = nextPair(currentPair, animeList);
          setAL(newList);
        }
        else{
          if(!correct){
            owarida(true);
            return;
          }
          setScore(score + 1);
          nextPair(currentPair, animeList);
        }
    }
    
    function nextPair(prev, list) {
        const [_, newest] = prev;
        let next;
    
        do {
          next = list[Math.floor(Math.random() * list.length)];
        }while(next.title === newest.title);
        
        const newPair = [newest, next];
        let newList = list;
    
        if(mode === "scored"){
          newList = list.filter(anime => anime.title !== next.title);
        }
    
        setP(newPair);
        return newList;
    }

    function restartGame(){
      setScore(0);
      owarida(false);
      setError(null);
      setL(false);
      setAL(ogList);
      setP([null,null]);
      setRound(0);

      const cute = ogList[Math.floor(Math.random() * ogList.length)];
      let funny;
      do {
        funny = ogList[Math.floor(Math.random() * ogList.length)];
      } while (cute.title === funny.title);

      setP([cute, funny]);

      let newList = ogList;
      if (mode === "scored") {
        newList = ogList.filter(anime => anime.title !== cute.title && anime.title !== funny.title);
      }
      setAL(newList);
    }

    if(loading){
        return (
        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "black", color: "white"}}>
            <div className="text-center">
              <div className="spinner-border text-light mb-4" style={{ width:"4rem", height:"4rem"}}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h3>Loading...</h3>
            </div>
        </div>
        );
    }

    if(error){
      return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "black", color: "white"}}>
          <h1 className="mb-3"style={{color: "crimson"}}>Error</h1>
          <img className="mb-3 img-fluid"src="./src/assets/error.webp" alt="error"></img>
          <div className="p-4 border rounded shadow bg-danger text-center mb-5" style={{ width:"100%", maxWidth: "400px"}}>{error}</div>
          <button className="btn btn-primary mt-3" onClick={onBack}>Back</button>
        </div>
      );
    }

    if(gameOver){
        return (
          <div className="container d-flex flex-column justify-content-center min-vh-100" style={{color:"white"}}>
            <div className="row justify-content-center align-items-center text-center">
                <div className="col-12 col-md-4 mb-3">
                  <h3 className="mb-3 text-break" style={{ maxWidth:"450px", margin: "0 auto", wordWrap: "break-word"}}>{currentPair[0].title}</h3>
                    <img src={currentPair[0].image} alt={currentPair[0].title} className="img-fluid rounded shadow" 
                    style={{ height: "600px", width: "100%", objectFit: "cover"}}></img>
                  <h5 className="mt-2">Score: {currentPair[0].score}</h5>
                </div>
                <div className="col-12 col-md-3 d-flex flex-column justify-content-center align-items-center mb-3">
                  <div className="p-4 rounded shadow text-center" style={{ width:"100%", maxWidth: "400px" }}>
                    <h1 className="mb-3">Game Over</h1>
                    <h2 className="mb-3 text-center">
                        Score: {score}
                        {(mode === "scored" && wholeList) && ` / ${ogList.length - 1}`}
                        {(mode === "scored" && !wholeList) && ` / ${rounds}`}
                    </h2>
                    <div className="d-flex gap-3 justify-content-center">
                      <button className="btn btn-primary mt-3" onClick={onBack}>Back</button>
                      <button className="btn btn-primary mt-3" onClick={restartGame}>Play Again</button>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4 mb-3">
                  <h3 className="mb-3 text-break" style={{ maxWidth:"450px", margin: "0 auto", wordWrap: "break-word"}}>{currentPair[1].title}</h3>
                    <img src={currentPair[1].image} alt={currentPair[1].title} className="img-fluid rounded shadow-sm" 
                    style={{ height: "600px", width: "100%", objectFit: "cover"}}></img>
                  <h5 className="mt-2">Score: {currentPair[1].score}</h5>
                </div>
            </div>
          </div>
        )
    }

    return (
      <div className="fade-in min-vh-100 d-flex flex-column" style={{backgroundColor: "black", minHeight:"100vh", color: "white", padding: "20px"}}>
        <div className="container flex-grow-1 d-flex flex-column justify-content-center">
          <div className="text-center mb-4">
            <h1>Score: {score}</h1>
            {(mode === "scored" && wholeList) && <p>Rounds Left: {ogList.length - round - 1}</p>}
            {(mode === "scored" && !wholeList) && <p>Rounds Left: {rounds - round}</p>}
          </div>
          <div className="row justify-content-center align-items-center text-center">
              <div className="col-12 col-md-5 mb-3">
                <h3 className="mb-3 text-break" style={{ maxWidth:"450px", margin: "0 auto", wordWrap: "break-word"}}>{currentPair[0].title}</h3>
                <button className="border border-light rounded bg-transparent p-0" onClick={() => handleGuess("lower")}>
                  <img src={currentPair[0].image} alt={currentPair[0].title} className="img-fluid rounded shadow" 
                  style={{ height: "600px", width: "100%", objectFit: "cover", cursor: "pointer"}}></img>
                </button>
                <h5 className="mt-2">Score: {currentPair[0].score}</h5>
              </div>
              <div className="col-12 col-md-2 mb-4 d-flex justify-content-center">
                <button className="btn btn-primary btn-lg fs-2" onClick={() => handleGuess("same")} style={{width: "200px"}}>Same</button>
              </div>
              <div className="col-12 col-md-5 mb-3">
                <h3 className="mb-3 text-break" style={{ maxWidth:"450px", margin: "0 auto", wordWrap: "break-word"}}>{currentPair[1].title}</h3>
                <button className="border border-light rounded bg-transparent p-0" onClick={() => handleGuess("higher")}>
                  <img src={currentPair[1].image} alt={currentPair[1].title} className="img-fluid rounded shadow-sm" 
                  style={{ height: "600px", width: "100%", objectFit: "cover", cursor: "pointer"}}></img>
                </button>
                <h5 className="mt-2">Score: ???</h5>
              </div>
          </div>
        </div>
      </div>

    )
}

/*
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
*/
