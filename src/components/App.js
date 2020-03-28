import React, { Component } from "react";

import Deck from "../classes/Deck";
import '../styles/App.css';

const deck = new Deck;
class App extends Component {

    state = {
        deck
    }

    setDeckState() {
        const deck = this.state.deck;
        this.setState({ deck });
    }

    shuffleCards() {
        this.state.deck.shuffleCards();
        this.setDeckState();
    }

    chooseCards(count) {
        this.state.deck.getCards(count);
        this.setDeckState();
    }

    render() {

        return (
            <div>
                <h1>PoHER</h1>

                <h2>Choosen Cards:</h2>
                {
                    this.state.deck.choosenCards.map((card) =>

                        <p>{ card.suit }, { card.faceValue }</p>
                    )
                }
                <button onClick = { this.chooseCards.bind(this, 2) } > CHOOSE CARDS </button>


                <h2>Deck:</h2>
                {
                    this.state.deck.cards.map((card) =>

                        <p>{ card.suit }, { card.faceValue }</p>
                    )
                }
                <button onClick = { this.shuffleCards.bind(this) } > SHUFFLE! </button>

            </div>
        );
    }
}

export default App;