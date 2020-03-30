import _ from "lodash";
import Deck from "./Deck";
import check from "./combinationChecker";

export default class Poker {

    constructor(players) {
        this.status = "pre-flop";
        this.deck = new Deck;
        this.players = players;
        this.tableCards = [];

        this._combinationsRating = {

        }
    }

    goNextStep() {
        
        switch(this.status) {
            case "pre-flop":
                this.preFlop(); break;
            case "flop":
                this.flop(); break;
            case "tern":
                this.tern(); break;
            case "river":
                this.river(); break;
            case "end":
                this.checkResults(); break;
        }

    }

    preFlop() {
        this.deck.shuffleCards();

        const cardsToGiveCount = 2;
        this.players.forEach((player) => {
            player.cards = this.deck.getCards(cardsToGiveCount);
        });

        this.status = "flop";
    }

    flop() {
        const flopCardsCount = 3;
        const flopCards = this.deck.getCards(flopCardsCount);
        this.tableCards.push(...flopCards);
        this.status = "tern"
    }

    tern() {
        const ternCardsCount = 1;
        const ternCards = this.deck.getCards(ternCardsCount);
        this.tableCards.push(...ternCards);
        this.status = "river";
    }

    river() {
        const riverCardsCount = 1;
        const riverCards = this.deck.getCards(riverCardsCount);
        this.tableCards.push(...riverCards);
        this.status = "end";
    }

    checkResults() {
        this.players.forEach((player) => {
            const playerCards = player.cards;
            const cards = playerCards.concat(this.tableCards);
            player.bestCombination = check.findBestCombination(cards);
        });
    }


}