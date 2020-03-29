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
        this.chosenCards = [];
    }

    // новая колода из всех возможных карт
    createDeck() {

        const newDeck = [];

        this._cardsFaceValue.forEach((faceValue) => {

            let weight;

            switch(faceValue) {
                case "Ace":
                    weight = 14; break;
                case "King":
                    weight = 13; break;
                case "Queen":
                    weight = 12; break;
                case "Jack":
                    weight = 11; break;
                default:
                    weight = +faceValue;
                    break;
            }

            this._cardsSuit.forEach((suit) => { 

                const newCard = {
                    faceValue,
                    suit,
                    weight
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
        const chosenCards = this.chooseCards(count);
        this.chosenCards.push(...chosenCards);
        this.removeCardsFromDeck(chosenCards);
        return chosenCards;
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