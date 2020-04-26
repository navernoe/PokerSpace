import React, { Component } from "react";
import Table from "./TableView";
import Players from "./PlayersView";
import "../styles/App.css";

class Game extends Component {
    constructor(props) {
        super(props);
        this.ws = props.ws;
        this.ws.onmessage = this.onReceiveMsg.bind(this);

        this.poker = {
            tableCards: []
        };
        this.players = [];
        this.pot = 0;
        this.state = {
            poker: this.poker,
            players: this.players,
            pot: this.pot
        };
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

        const playerInBetQueue = this.poker.playersManager.playerInBetQueue;

        // TODO: why there is no delay for the last bot ??!
        if (
            playerInBetQueue
            && !playerInBetQueue.isRealMan
        ) {
            this.setDelay(2000);
            this.ws.send(JSON.stringify({
                action: "doBetsByBots"
            }));
        }
    }


    setDelay( delayDuration ){
        const timeStart = new Date().getTime();
        let now = new Date().getTime();

        while( now < timeStart + delayDuration ) {
            now = new Date().getTime();
        }
    }


    startGame() {
        this.ws.send(JSON.stringify({
            action: "start"
        }));
    }


    joinGame() {
        this.ws.send(JSON.stringify({
            action: "join",
            gameId: 1
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

                <button className = "startBtn" onClick = {this.startGame.bind(this)}>start</button>
                <button className = "joinBtn" onClick = {this.joinGame.bind(this)}>JOIN</button>
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

export default Game;