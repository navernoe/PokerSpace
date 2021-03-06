import _ from "lodash";
import combinations from "./combinations.js";
import Player from "./Player.js";

export default class PlayersManager {
    constructor(params) {
        this.pot = params.pot || 0;
        this.bet = params.bet || 40;
        this.isCompletePot = params.isCompletePot || false;
        this.players = params.players.map((player) => new Player(player));

        if ( params.playerInBetQueue ) {
            this.playerInBetQueue = new Player(params.playerInBetQueue);
        }
    }

    setBlinds() {
        this.players.forEach((player) => {
            // если playerInBetQueue уже есть -
            // значит дилера уже назначили и блайнды сделали
            if ( player.isDealer && !this.playerInBetQueue ) {
                let nextPlayer = this._getNextPlayer(player);
                this._setSmallBlind(nextPlayer);

                nextPlayer = this._getNextPlayer(nextPlayer);
                this._setBigBlind(nextPlayer);

                nextPlayer = this._getNextPlayer(nextPlayer);
                this._updQueue(nextPlayer);
            }
        });
    }

    check(player) {
        player.check();
        this._setBetQueue();
        //this.doBets();
    }

    call(player) {
        player.call(this.bet);
        this._setBetQueue();
        //this.doBets();
    }

    raise(player, raiseSum) {
        this.bet += raiseSum;
        player.raise(this.bet);
        this._setBetQueue();
        //this.doBets();
    }

    // следующий дилер = следующий игрок после дилера
    // или первый игрок - если это первая партия
    setDealer() {
        let nextDealer;

        this.players.forEach((player) => {

            if ( player.isDealer && !nextDealer ) {
                nextDealer = this._getNextPlayer(player);
                player.isDealer = false;
                nextDealer.isDealer = true;
            }
        });

        // если это первая партия то делаем первого игрока дилером
        if ( !nextDealer ) {
            this.players[0].isDealer = true;
        }

    }

    // раздача карт каждому игроку
    dealTheCards(deck) {
        const cardsToGiveCount = 2;

        this.players.forEach((player) => {
            player.cards = deck.getCards(cardsToGiveCount);
        });
    }


    doBet() {
        this.call(this.playerInBetQueue);
    }


    doBets() {
        // делаем ставки за ботов
        // до тех пор пока не придет очередь живого человека,
        // либо пока все ставки не станут равными
        while (
            !this.playerInBetQueue.isRealMan
            && !this.isAllBetsEqual()
        ) {
            this.call(this.playerInBetQueue);
        }
    }


    _updQueue(player) {

        if ( this.playerInBetQueue ) {
            this.playerInBetQueue.inQueue = false;
        }

        if ( player ) {
            player.inQueue = true;
            this.playerInBetQueue = player;
        } else {
            delete this.playerInBetQueue;
        }
    }


    _setSmallBlind(player) {
        player.setBet(this.bet / 2);
        player.setStatus("smallBlind");
    }


    _setBigBlind(player) {
        player.setBet(this.bet);
        player.setStatus("bigBlind");
    }


    // ставит в очередь следующего игрока
    _setBetQueue() {
        const nextPlayer = this._getNextActivePlayer(this.playerInBetQueue);
        this._updQueue(nextPlayer);
    }


    // проверяет - равны ли все ставки, сделанные игроками
    isAllBetsEqual() {
        return !this.players.some((player) => {
            const isBetEqual = (player.bet === this.bet);
            const isFold = player.isFold();
            const isAwait = player.isAwait();

            return (
                (
                    !isBetEqual
                    && !isFold
                )
                || isAwait
            );
        });
    }


    // находит следующего игрока, который в игре
    _getNextActivePlayer(player) {
        let nextActivePlayer;
        let nextPlayer = this._getNextPlayer(player);

        while ( !nextActivePlayer ) {

            if ( !nextPlayer.isFold() ) {
                nextActivePlayer = nextPlayer;
            }
            nextPlayer = this._getNextPlayer(nextPlayer);
        }

        return nextActivePlayer;
    }


    // находит следующего игрока
    _getNextPlayer(player) {
        const playersLastIndex = this.players.length - 1;
        const playerIndex = this.players.indexOf(player);

        if ( playerIndex == playersLastIndex ) {

            return this.players[0];

        } else {

            return this.players[ playerIndex + 1 ];
        }
    }


    // находит лучшую комбинацию для каждого игрока
    setBestCombination(tableCards) {

        this.players.forEach((player) => {
            const playerCards = player.cards;
            const cards = playerCards.concat(tableCards);
            player.bestCombination = combinations.findBestCombination(cards);
        });
    }


    getWinners() {
        const winningComb = _.maxBy(this.players, "bestCombination.weight").bestCombination;
        const winners = this.players.filter((player) =>
            player.bestCombination.weight === winningComb.weight
        );

        return winners;
    }


    setWinners(winners) {
        winners.forEach((winner) => winner.isWinner = true);
    }


    sharePot(winners) {
        const sharingSum = this.pot / winners.length;
        this.pot = 0;
        winners.forEach(winner => winner.chipsStack += sharingSum);
    }


    final(tableCards) {
        this.setBestCombination(tableCards);
        const winners = this.getWinners();
        this.setWinners(winners);
        this.sharePot(winners);
    }


    // когда ставки равны - они собираются в пот
    setPot() {
        let betsSum = 0;

        this.players.forEach((player) => {
            betsSum += player.bet;
            player.bet = 0;
        });

        this.pot += betsSum;
        this.bet = 0;
        this.isCompletePot = true;
        this.resetPlayersStatus();
    }


    resetPlayersStatus() {
        this.players.forEach((player) => {
            player.setStatus("awaiting");
        });
    }


    // для начала следующей партии
    resetGame() {
        this.bet = 40;
        this.pot = 0;
        this.resetPlayersInfo();
        this.resetPlayersStatus();
        this._updQueue();
        this.isCompletePot = false;
    }


    resetPlayersInfo() {

        this.players.forEach((player) => {
            player.cards = [];
            player.bet = 0;
            player.isWinner = false;
            delete player.bestCombination;
        });
    }


    addNewPlayer(player) {
        this.players.push(new Player(
            player.name,
            player.isRealMan
        ));
    }

}