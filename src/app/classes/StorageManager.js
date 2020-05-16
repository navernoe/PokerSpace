/**
 *    - в файле с игрой хранится список всех сыгранных партий (matches),
 *      а точнее, последнее состояние каждой сыгранной (или не доигранной) партии
 *
 *    - в файле gamesStatus хранится информация по всем существующим играм,
 *      а именно:
 *          'status' - последний статус из текущей партии,
 *          'matchId' - порядковый номер последней партии
 *
 */
import fs from "fs";
import gamesStatus from "./../data/gamesData/gamesStatus.json";

const gamesDataDir = fs.realpathSync("./src/app/data/gamesData");
const gamesStatusPath = gamesDataDir + "/gamesStatus.json";

class StorageManager {
    constructor() {
        //gamesStatus = fs.readFileSync(gamesStatusPath).toString();
    }

    getGamesList() {
        const gamesList = Object.assign({}, gamesStatus);

        return gamesList;
    }

    isGameExists(gameId) {
        return !!gamesStatus[gameId];
    }

    getGamePath(gameId) {
        return gamesDataDir + "/" + gameId + ".json";
    }

    getGame(gameId) {
        const gamePath = this.getGamePath(gameId);
        const game = JSON.parse(fs.readFileSync(gamePath, "utf8"));
        const matchId = gamesStatus[gameId].matchId;
        const match = game[matchId];

        return match;
    }

    writeGame(game, gameId) {
        this.changeGameStatus(gameId, game.status);

        const matchId = gamesStatus[gameId].matchId;
        const matchStatus = gamesStatus[gameId].status;
        const gamePath = this.getGamePath(gameId);

        if ( matchStatus !== "start" ) {
            fs.readFile(gamePath, (err, matches) => {
                if (err) console.log(err);
    
                matches = JSON.parse(matches);
                matches[matchId] = game;
    
                fs.writeFile(gamePath, JSON.stringify(matches), (err) => {
                    if (err) console.log(err);
                });
            });

        } else {
            fs.writeFile(gamePath, JSON.stringify({ [matchId]: game }), (err) => {
                if (err) console.log(err);
            });
        }
    }

    removeGame(gameId) {
        const gamePath = this.getGamePath(gameId);
        fs.unlinkSync(gamePath);
        this.changeGameStatus(gameId);
    }

    changeGameStatus(gameId, status) {
        if ( status ) {
            this._setGameStatus(gameId, status);
        } else {
            this._removeGameStatus(gameId);
        }

        this._writeGameStatusFile();
    }

    _setGameStatus(gameId, status) {
        if ( gamesStatus[gameId] ) {
            gamesStatus[gameId].status = status;
        } else {
            gamesStatus[gameId] = {
                status,
                matchId: 1
            };
        }
    }

    _removeGameStatus(gameId) {
        delete gamesStatus[gameId];
    }

    _writeGameStatusFile() {
        fs.writeFile(gamesStatusPath, JSON.stringify(gamesStatus), (err) => {
            if (err) console.log(err);
        });
    }

}

export default new StorageManager();