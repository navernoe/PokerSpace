import _ from "lodash";
import Deck from "./Deck.js";
import PlayersManager from "./PlayersManager.js";

export default class Poker {
    constructor(params) {
        const playerManagerParams = params.playersManager || { players: params.players };
        this.playersManager = new PlayersManager(playerManagerParams);
        this.status = params.status || "start";
        this.deck = new Deck(params.deck);
        this.tableCards = params.tableCards || [];
    }


    setStatus(status) {
        this.status = status;
    }


    goNextStep(isFirst = false) {
        switch(this.status) {
            case "start":
                this.start(); break;
            case "pre-flop":
                this.preFlop(isFirst); break;
            case "flop":
                this.flop(isFirst); break;
            case "tern":
                this.tern(isFirst); break;
            case "river":
                this.river(isFirst); break;
            case "end":
                this.playersManager.final(this.tableCards);
                this.setStatus("start");
                break;
        }
    }


    start() {
        this.clearTable();
        this.playersManager.resetGame();
        this.deck.createNewDeck();
        this.deck.shuffleCards();
        this.playersManager.setDealer();

        this.setStatus("pre-flop");
        this.goNextStep(true);
    }


    preFlop(isFirst) {

        // блайнды и раздача только один раз
        if ( isFirst ) {
            this.playersManager.setBlinds();
            this.playersManager.dealTheCards(this.deck);
            // this.playersManager.doBets();
        }

        if ( this.playersManager.isAllBetsEqual() && !this.playersManager.isCompletePot ) {
            this.playersManager.setPot();
            this.setStatus("flop");
            this.goNextStep(true);
        } else {
           // this.playersManager.doBets();
        }
    }


    flop(isFirst) {

        if ( isFirst ) { // раздача только один раз
            this.playersManager.isCompletePot = false;
            const flopCardsCount = 3;
            const flopCards = this.deck.getCards(flopCardsCount);
            this.tableCards.push(...flopCards);
        }

        if ( this.playersManager.isAllBetsEqual() && !this.playersManager.isCompletePot ) {
            this.playersManager.setPot();
            this.setStatus("tern");
            this.goNextStep(true);
        } else {
            // this.playersManager.doBets();
        }

    }


    tern(isFirst) {

        if ( isFirst ) { // раздача только один раз
            this.playersManager.isCompletePot = false;
            const ternCardsCount = 1;
            const ternCards = this.deck.getCards(ternCardsCount);
            this.tableCards.push(...ternCards);
        }

        if ( this.playersManager.isAllBetsEqual() && !this.playersManager.isCompletePot ) {
            this.playersManager.setPot();
            this.setStatus("river");
            this.goNextStep(true);
        } else {
            // this.playersManager.doBets();
        }
    }


    river(isFirst) {

        if ( isFirst ) { // раздача только один раз
            this.playersManager.isCompletePot = false;
            const riverCardsCount = 1;
            const riverCards = this.deck.getCards(riverCardsCount);
            this.tableCards.push(...riverCards);
        }

        if ( this.playersManager.isAllBetsEqual() && !this.playersManager.isCompletePot ) {
            this.playersManager.setPot();
            this.setStatus("end");
            this.goNextStep();
        } else {
            // this.playersManager.doBets();
        }
    }


    clearTable() {
        this.tableCards = [];
    }

}