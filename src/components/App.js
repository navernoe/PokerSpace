import React, { Component } from "react";

import Poker from "../classes/Poker";
import Players from "./Players";
import Table from "./Table";

import '../styles/App.css';


const createNewPlayers = () => {
    return [
        {
            name: "Player1"
        },
        {
            name: "Player2"
        },
        {
            name: "Player3",
            isRealMan: true
        },
        {
            name: "Player4"
        },
        {
            name: "Player5",
            isRealMan: true
        }

    ];
}

const players = createNewPlayers();
const poker = new Poker(players);
const playersManager = poker.playersManager;
const realPlayer = () => playersManager.playerInBetQueue;

class App extends Component {

    state = {
        poker,
        players: playersManager.players
    }

    setPokerState() {
        const players = playersManager.players;
        this.setState({ poker,  players });
    }

    startNewGame() {
        this.state.poker.start();
        this.setPokerState();
    }


    doAction(action) {

        let raiseSum;

        if ( action === "raise" ) {
            raiseSum = +document.querySelector(".betSum").value;
        }

        playersManager[action](realPlayer(), raiseSum);
        poker.goNextStep();

        this.setPokerState();
    }

    render() {

        return (
            <div>
                <h1>PoHER</h1>

                <button className = "startBtn" onClick = {this.startNewGame.bind(this)}> STARRT NEW GAME</button>

                <h2>TABLE:</h2>
                <Table tableCards = {poker.tableCards} pot = {playersManager.pot} />

                <h2>Players:</h2>
                <Players players = {this.state.players} />

                <input className = "betSum" type="number"></input>
                <button className = "checkBtn" onClick = {this.doAction.bind(this, "check")}> CHECK </button>
                <button className = "callBtn" onClick = {this.doAction.bind(this, "call")}> CALL </button>
                <button className = "raiseBtn" onClick = {this.doAction.bind(this, "raise")}> RAISE </button>
                <button className = "foldBtn" onClick = {this.doAction.bind(this, "fold")}> FOLD </button>

            </div>
        );
    }
}

export default App;