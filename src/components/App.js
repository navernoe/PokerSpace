import React, { Component } from "react";

import Players from "./PlayersView";
import Table from "./TableView";
import "../styles/App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.poker = {
            tableCards: []
        };
        this.players = [];
        this.pot = 0;
        this.ws = new WebSocket("ws://localhost:3000");
        this.ws.onmessage = this.onReceiveMsg.bind(this);
        this.ws.onopen = this.onConnectionOpen.bind(this);
        this.state = {
            poker: this.poker,
            players: this.players,
            pot: this.pot
        };
    }


    onConnectionOpen() {
        alert("Соединение установлено.");
    }


    setPokerState() {
        this.setState({
            poker: this.poker,
            players: this.players
        });
    }


    onReceiveMsg({data}) {
        const dataObj = JSON.parse(data);
        const poker = dataObj.poker;
        this.poker = poker;
        this.players = poker.playersManager.players;
        this.pot = poker.playersManager.pot;
        this.setPokerState();
    }


    createOrJoinGame() {
        this.ws.send(JSON.stringify({
            action: "join",
            gameId: document.querySelector(".game-id").value
        }));
    }

    startGame() {
        this.ws.send(JSON.stringify({
            action: "start"
        }));
    }


    doAction(action) {
        let raiseSum;

        if ( action === "raise" ) {
            raiseSum = +document.querySelector(".betSum").value;
        }

        this.ws.send(JSON.stringify({
            action,
            raiseSum
        }));
    }


    render() {
        return (
            <div>
                <h1>PoHER</h1>

                <input className = "game-id" type="text"></input>
                <button className = "joinGameBtn" onClick = {this.createOrJoinGame.bind(this)}> CREATE OR JOIN GAME</button>

                <button className = "startBtn" onClick = {this.startGame.bind(this)}>start</button>
                <h2>TABLE:</h2>
                <Table tableCards = {this.state.poker.tableCards} pot = {this.state.pot} />

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