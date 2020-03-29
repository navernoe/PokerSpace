import _ from "lodash";
import Deck from "./Deck";

export default class Poker {

    constructor(players) {
        this.status = "start";
        this.deck = new Deck;
        this.players = players;
        this.tableCards = [];

        this._combinationsRating = {

        }
    }

    goNextStep() {
        
        switch(this.status) {
            case "start":
                this.start();break;
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

    start() {
        this.deck.shuffleCards();

        const cardsToGiveCount = 2;
        this.players.forEach((player) => {
            player.cards = this.deck.getCards(cardsToGiveCount);
        });

        this.status = "pre-flop";
    }

    preFlop() {
        const preFlopCardsCount = 3;
        const preFlopCards = this.deck.getCards(preFlopCardsCount);
        this.tableCards.push(...preFlopCards);
        this.status = "flop"
    }

    flop() {
        const flopCardsCount = 1;
        const flopCards = this.deck.getCards(flopCardsCount);
        this.tableCards.push(...flopCards);
        this.status = "tern";
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
            player.bestCombination = this.findBestCombination(player.cards);
        });
    }

    findBestCombination(handCards) {

        const cards = handCards.concat(this.tableCards);

        const royalFlush = this.checkRoyalFlush(cards);
        if ( royalFlush ) {
            return royalFlush;
        }

        const straightFlush = this.checkStraightFlush(cards);
        if ( straightFlush ) {
            return straightFlush;
        }

        const quads = this.checkQuads(cards);
        if ( quads ) {
            return quads;
        }

        const fullHouse = this.checkFullHouse(cards);
        if ( fullHouse ) {
            return fullHouse;
        }

        const flush = this.checkFlush(cards);
        if ( flush ) {
            return flush;
        }

        const straight = this.checkStraight(cards);
        if ( straight ) {
            return straight;
        }

        const trips = this.checkSet(cards);
        if ( trips ) {
            return trips;
        }

        const twoPairs = this.checkTwoPairs(cards);
        if ( twoPairs ) {
            return twoPairs;
        }

        const pair = this.checkPair(cards);
        if ( pair ) {
            return pair;
        }

        const highCard = this.chooseHighCard(cards);
        return highCard;
    }

    checkRoyalFlush(cards) {
        const aces = cards.filter(card =>
            card.faceValue === "Ace"
        );

        if ( !aces.length ) {
            return false;
        }

        const acesSuits = aces.map(ace => ace.suit);
        const kings = cards.filter(card =>
            card.faceValue === "King" && acesSuits.includes(card.suit)
        );

        if ( !kings.length ) {
            return false;
        }

        const kingsSuits = kings.map(king => king.suit);
        const queens = cards.filter(card =>
            card.faceValue === "Queen" && kingsSuits.includes(card.suit)
        );

        if ( !queens.length ) {
            return false;
        }

        const queenSuits = queens.map(queen => queen.suit);
        const jacks = cards.filter(card =>
            card.faceValue === "Jack" && queenSuits.includes(card.suit)
        );

        if ( !jacks.length ) {
            return false;
        }

        const jackSuits = jacks.map(jack => jack.suit);
        const tens = cards.filter(card =>
            card.faceValue === "10" && jackSuits.includes(card.suit)
        );

        if ( !tens.length ) {
            return false;
        } else {
            return true;
        }
    }

    checkStraightFlush(cards) {

        let groups = [];
        const suitsGroups = _.groupBy(cards, (card) => card.suit);

        Object.keys(suitsGroups).forEach((key) => {
            groups.push(suitsGroups[key]);
        });

        groups = groups.filter(group => group.length >= 5);

        
        if ( !groups.length ) {
            return false;
        }

        let straightFlushGroups = groups.map((group) =>
            this.checkStraight(group)
        );

        straightFlushGroups = straightFlushGroups.filter(group => group);

        if ( !straightFlushGroups ) {
            return false;
        }

        return _.maxBy(straightFlushGroups, (group) => _.maxBy(group, "weight"));
    }

    checkStraight(cards) {

        const sortedCards = _.sortBy(cards, "weight");
        const uniqSortedCards = _.sortedUniqBy(sortedCards, "weight");
        const uniqCount = uniqSortedCards.length; 

        let chunkInd = 0;
        let currentCardWeight = uniqSortedCards[0].weight;
        let chunks = [[]];

        for (let i =0; i < uniqCount; i++) {

            const card = uniqSortedCards[i];
            const weight = card.weight;

            if ( weight - currentCardWeight > 1 ) {
                chunks[++chunkInd] = [];
            }

            chunks[chunkInd].push(card);
            currentCardWeight = weight;
        }

        chunks = chunks.filter(chunk => chunk.length >= 5);

        if ( !chunks.length ) {
            return false;
        }

        let bestStraight = chunks[chunks.length - 1];
        bestStraight.splice(0, bestStraight.length - 5);

        return bestStraight;
    }

    checkFlush(cards) {

        let flush = [];
        let groups = [];
        const suitsGroups = _.groupBy(cards, (card) => card.suit);

        Object.keys(suitsGroups).forEach((key) => {
            groups.push(suitsGroups[key]);
        });

        groups = groups.filter(group => group.length >= 5);

        if ( !groups.length ) {
            return false;
        }

        if ( groups.length === 1 ) {
            flush = _.sortBy(groups[0], "weight");
            flush.splice(0, flush.length - 5);
            return flush;
        }

        // если всего 7 карт (2 в руке и 5 на столе) -
        // то такой ситуации не должно быть =)
        let bestFlush = _.maxBy(groups, (group) => _.maxBy(group, "weight"));
        bestFlush.splice(0, bestFlush.length - 5);
        return bestFlush;
    }

}