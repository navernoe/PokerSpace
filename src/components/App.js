import React, { Component } from "react";

import Poker from "../classes/Poker";
import '../styles/App.css';

function Card(props) {
    return (
        <li>{props.suit} {props.faceValue}</li>
    );
}

const createNewPlayers = () => {
    return [
        {
            name: "Player1"
        },
        {
            name: "Player2"
        },
        {
            name: "Player3"
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
const realPlayer = playersManager.players.find((player) => player.isRealMan);

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

    renderTable() {
        const tableElements = poker.tableCards.reduce((elements, card) => {
            return [
                ...elements,
                React.createElement(
                    "div",
                    {className: "tableCard"},
                    `${card.suit} ${card.faceValue}`
                )
            ];
        }, [
            React.createElement(
                "div",
                {className: "pot"},
                `POT: ${playersManager.pot}`
            )
        ]);

        return tableElements
    }

    renderPlayers() {

        const playersElements = this.state.players.reduce((elements, player) => {

            const infoClassName = player.isDealer ? { className: "player-info dealer" } : {className: "player-info"};
            const playerClassName = player.isWinner ? { className: "player winner" } : { className: "player" };

            const newPlayerEl = React.createElement(
                "div",
                playerClassName,
                [
                    React.createElement(
                        "div",
                        infoClassName,
                        player.name
                    ),

                    React.createElement(
                        "div",
                        {className: "player-cards"},
                        React.createElement(
                            "ul",
                            {className: ""},
                            player.cards ? player.cards.map(card => <Card faceValue={card.faceValue} suit={card.suit} />) : ""
                        )
                    ),

                    React.createElement(
                        "div",
                        {className: "player-bet"},
                        player.bet
                    ),

                    React.createElement(
                        "div",
                        {className: "player-bestcombination"},
                        React.createElement(
                            "ul",
                            {className: ""},
                            [
                                player.bestCombination ? player.bestCombination.name : "",
                                player.bestCombination && player.bestCombination.cards ? player.bestCombination.cards.map(card => <Card faceValue={card.faceValue} suit={card.suit} />) : "",
                                player.bestCombination && player.bestCombination.highCards ? player.bestCombination.highCards.map(card => <Card faceValue={card.faceValue} suit={card.suit} />) : ""

                            ] 
                            
                        )
                    )
                ]
            );

            return [...elements, newPlayerEl];
        }, []);

        return playersElements;
    }


    doAction(action) {

        let raiseSum;

        if ( action === "raise" ) {
            raiseSum = +document.querySelector(".betSum").value;
        }

        playersManager[action](realPlayer, raiseSum);
        poker.goNextStep();

        this.setPokerState();
    }

    render() {

        return (
            <div>
                <h1>PoHER</h1>

                <button className = "startBtn" onClick = {this.startNewGame.bind(this)}> STARRT NEW GAME</button>

                <h2>TABLE:</h2>
                {
                    this.renderTable()
                }

                <h2>Players:</h2>
                {
                    this.renderPlayers()
                }

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