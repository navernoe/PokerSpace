export default class Player {
    constructor(params) {
        this.name = params.name;
        this.isRealMan = params.isRealMan || false;
        this.chipsStack = params.chipsStack || 1000;
        this.bet = params.bet || 0;
        this.status = params.status || "awaiting"; // в ожидании своего хода
        this.inQueue = params.inQueue || false;
        this.isDealer = params.isDealer || false;
        this.cards = params.cards || [];
        this.isWinner = params.isWinner || false;
    }

    setBet(bet) {
        this.chipsStack -= bet;
        this.bet += bet;
    }

    check() {
        this.setStatus("check");
    }

    call(bet) {
        const diffBet = bet - this.bet;
        this.setBet(diffBet);
        this.setStatus("call");
    }

    raise(bet) {
        const diffBet = bet - this.bet;
        this.setBet(diffBet);
        this.setStatus("raise");
    }

    fold() {
        this.setStatus("fold");
    }

    setStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }

    isFold() {
        return this.getStatus() === "fold";
    }

    isAwait() {
        return this.getStatus() === "awaiting";
    }

}