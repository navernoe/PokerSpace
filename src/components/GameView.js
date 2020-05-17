import React, { Component } from "react";
import { Link } from "react-router-dom";
import TableView from "./TableView";
import PlayersView from "./PlayersView";
import "../styles/App.css";

class GameView extends Component {
    constructor(props) {
        super(props);
        this.ws = props.ws;
        this.ws.onmessage = this.onReceiveMsg.bind(this);
        this.gameId = props.match.params.game_id;
        this.ws.gameId = this.gameId;
        this.state = {
            poker: {
                tableCards: []
            },
            players: [],
            pot: 0
        };
        this.loadGame();
    }

    setPokerState() {
        this.setState({
            poker: this.poker,
            players: this.players,
            pot: this.poker.playersManager.pot
        });
    }

    loadGame() {
        this.ws.send(JSON.stringify({
            action: "loadGame",
            gameId: this.gameId
        }));
    }

    onReceiveMsg({data}) {
        const dataObj = JSON.parse(data);

        if ( dataObj.msgTag === "error" ) {
            console.log(dataObj.error);
            return;
        }

        const poker = dataObj.poker;
        this.poker = poker;
        this.players = poker.playersManager.players;
        this.pot = poker.playersManager.pot;
        this.setPokerState();


        const playerInBetQueue = this.poker.playersManager.playerInBetQueue;
        if (
            playerInBetQueue
            && !playerInBetQueue.isRealMan
            && this.poker.statue !== "start"
        ) {
            this.doBetByBot();
        }
    }

    doBetByBot() {
        // TODO: why there is no delay for the last bot ??!
        this.setDelay(500);
        this.ws.send(JSON.stringify({
            action: "doBetByBot"
        }));
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

    resetGame() {
        this.ws.send(JSON.stringify({
            action: "resetGame"
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
                <Link to="/">
                    НАЗАД
                </Link>
                <h1>PoHER</h1>

                <button className = "startBtn" onClick = {this.startGame.bind(this)}>start</button>
                <button className = "resetBtn" onClick = {this.resetGame.bind(this)}>reset</button>
                <h2>TABLE:</h2>
                <TableView tableCards = {this.state.poker.tableCards} pot = {this.state.pot} />

                <h2>Players:</h2>
                <PlayersView players = {this.state.players} />

                <input className = "betSum" type="number"></input>
                <button className = "checkBtn" onClick = {this.doAction.bind(this, "check")}> CHECK </button>
                <button className = "callBtn" onClick = {this.doAction.bind(this, "call")}> CALL </button>
                <button className = "raiseBtn" onClick = {this.doAction.bind(this, "raise")}> RAISE </button>
                <button className = "foldBtn" onClick = {this.doAction.bind(this, "fold")}> FOLD </button>

            </div>
        );
    }
}

export default GameView;