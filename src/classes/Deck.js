import _ from "lodash";

export default class Deck {

    constructor() {

        this._cardsSuit = [
            "Hearts",
            "Spades",
            "Diamonds",
            "Clubs"
        ];

        this._cardsFaceValue = [
            "Ace",
            "King",
            "Queen",
            "Jack",
            "10",
            "9",
            "8",
            "7",
            "6",
            "5",
            "4",
            "3",
            "2"
        ];

        this.cards = this.createDeck();
        this.choosenCards = [];
    }

    // новая колода из всех возможных карт
    createDeck() {

        const newDeck = [];

        this._cardsFaceValue.forEach((faceValue) => {

            this._cardsSuit.forEach((suit) => {
                const newCard = {
                    faceValue,
                    suit
                }

                newDeck.push(newCard);
            });
        });

        return newDeck;
    }

    // перемешивает колоду
    shuffleCards() {
       this.cards = _.shuffle(this.cards);
    }

    // берет из колоды указанное кол-во карт
    getCards(count) {
        const choosenCards = this.chooseCards(count);
        this.choosenCards.push(...choosenCards);
        this.removeCardsFromDeck(choosenCards);
    }

    // выбирает в колоде указанное кол-во карт
    chooseCards(count) {
        return _.take(this.cards, count);
    }

    // удаляет из колоды указанные карты
    removeCardsFromDeck(cards) {
        _.pullAll(this.cards, cards);
    }

    
}