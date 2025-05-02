import { useState } from "react";

export default function HomeScreen({ onStart }){
    const [username, setUsername] = useState("");
    const [mode, setMode] = useState("scored");
    const [rounds, setRounds] = useState(20);
    const [tutorial, setTutorial] = useState(false);

    function submit(e){
        e.preventDefault();

        if(username === ""){
            alert("Please enter a username");
            return;
        }

        const settings = {
            username: username,
            mode: mode,
            rounds: mode === "scored" ?  rounds: null
        };

        onStart(settings);
    }

    if(tutorial){
        return(
            <div className="d-flex flex-column justify-content-center align-items-center min-vh-100" style={{color:"white"}}>
                <div className="p-4 border rounded shadow bg-secondary mb-4" style={{maxWidth:"400px", width:"100%"}}>
                    <h2 className="mb-4 text-center">Tutorial</h2>
                    <ul>
                        <li>Enter MAL username</li>
                        <li>Select a game mode. Scored will set a certain number of rounds, while in endless you play until you get one wrong</li>
                        <li>Select number of rounds if game mode is scored</li>
                        <li>In each round you will see two anime from the list. Click on whichever one you think has the higher personal score,
                            or "Same" if you think they're equal.
                        </li>
                        <li>Try to get the highest score you can</li>
                    </ul>
                </div>
                <button className="btn btn-primary" onClick={() => setTutorial(false)}>Back</button>
            </div>
        )
    }

    return(
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 px-2">
            <img src="./src/assets/hol.webp" alt="hol logo" className="img-fluid" style={{maxWidth:"200px"}}></img>
            <h3 className="text-center mb-5" style={{color:"#0096FF"}}>Anime List Edition</h3>
            <h2 className="text-center mb-5" style={{color:"white", maxWidth:"600px"}}>How well do you know your or someone else's anime list?
                Find out with this version of anime higher or lower based off user scores.
            </h2>
            <div className="p-4 border rounded shadow bg-white mb-4" style={{ width: "100%", maxWidth:"400px" }}>
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label">MAL Username</label>
                        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Game Mode</label>
                        <select className="form-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                            <option value="scored">Scored</option>
                            <option value="endless">Endless</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Rounds</label>
                        <select className="form-select" value={rounds} onChange={(e) => setRounds(Number(e.target.value))} disabled={mode !== "scored"}>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={40}>40</option>
                            <option value={50}>50</option>
                            <option value={0}>All scored anime</option>
                        </select>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">
                            Start Game
                        </button>
                    </div>
                </form>
            </div>
            <div className="text-center mb-4">
                <button className="btn btn-info" onClick={() => setTutorial(true)}>Tutorial</button>
            </div>
        </div>
    )
}