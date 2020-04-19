export default class Player {

    constructor(name, isRealMan = false) {
        this.name = name;
        this.isRealMan = isRealMan;
        this.chipsStack = 1000;
        this.bet = 0;
        this.status = "awaiting"; // в ожидании своего хода
        this.inQueue = false;
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

}