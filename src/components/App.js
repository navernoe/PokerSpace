import React, { Component } from "react";

import Poker from "../classes/Poker";
import '../styles/App.css';

const poker = new Poker;
class App extends Component {

    state = {
        poker,
        countToChoose: 2,
        result: []
    }

    startNewGame() {
        this.state.poker = new Poker;
        this.setPokerState();
    }

    setPokerState() {
        const poker = this.state.poker;
        this.setState({ poker });
    }

    shuffleCards() {
        this.state.poker.deck.shuffleCards();
        this.setPokerState();
    }

    chooseCards(count) {
        this.state.poker.deck.getCards(count);
        this.setPokerState();
    }

    onChangeInput({target: { value }}) {
        this.setState({countToChoose: value });
    }

    checkStraightFlush() {
        const result = this.state.poker.checkStraightFlush(this.state.poker.deck.chosenCards);
        if ( result ) {
            this.setState({ result });
        } else {
            this.setState({ result: [] });
        }
        
    }

    render() {

        return (
            <div>
                <h1>PoHER</h1>

                <h2>Chosen Cards:</h2>
                {
                    this.state.poker.deck.chosenCards.map((card) =>

                        <p>{ card.suit }, { card.faceValue }</p>
                    )
                }
                <input type = "number" onChange={ this.onChangeInput.bind(this) }></input>
                <button onClick = { this.chooseCards.bind(this, this.state.countToChoose) } > CHOOSE CARDS </button>


                <button onClick = {this.checkStraightFlush.bind(this)}> CHECK FLUSH</button>

                <h2>RESULT</h2>

                {
                    this.state.result.map((card) =>

                        <p>{ card.suit }, { card.faceValue }</p>
                    )

                }

                <h2>TABLE : </h2>
                {
                    this.state.poker.tableCards.map((card) =>
                        <p>{ card.suit }, { card.faceValue }</p>
                    )
                }


                <h2>Deck:</h2>
                {
                    this.state.poker.deck.cards.map((card) =>

                        <p>{ card.suit }, { card.faceValue }</p>
                    )
                }
                <button onClick = { this.shuffleCards.bind(this) } > SHUFFLE! </button>

            </div>
        );
    }
}

export default App;