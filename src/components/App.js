import React, { Component } from "react";

import Poker from "../classes/Poker";
import '../styles/App.css';

function Card(props) {
    return (
        <li>{props.suit} {props.faceValue}</li>
    );
}

class App extends Component {

    state = {}

    setPokerState() {
        const poker = this.state.poker;
        this.setState({ poker });
    }

    startNewGame() {
        const players = this.createNewPlayers();
        const poker = new Poker(players);

        this.setState({ poker });
    }

    createNewPlayers() {
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
                name: "Player5"
            }

        ];
    }

    renderTable() {

        if ( !this.state.poker ) {
            return "";
        }

        const tableElements = this.state.poker.tableCards.reduce((elements, card) => {
            return [
                ...elements,
                React.createElement(
                    "div",
                    {className: "tableCard"},
                    `${card.suit} ${card.faceValue}`
                )
            ];
        }, []);

        return tableElements
    }

    renderPlayers() {

        if ( !this.state.poker ) {
            return "";
        }

        const playersElements = this.state.poker.players.reduce((elements, player) => {
            const newPlayerEl = React.createElement(
                "div",
                { className: "player" },
                [
                    React.createElement(
                        "div",
                        {className: "player-info"},
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
                    )
                ]
            );

            return [...elements, newPlayerEl];
        }, []);

        return playersElements;
    }


    goNext() {
        this.state.poker.goNextStep();
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

                <button className = "goNextBtn" onClick = {this.goNext.bind(this)}> GO NEXT STEP</button>

            </div>
        );
    }
}

export default App;