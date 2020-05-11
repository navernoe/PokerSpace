import fs from "fs";
import gamesStatus from "./../data/gamesData/gamesStatus.json";

const gamesDataDir = fs.realpathSync("./src/app/data/gamesData");
const gamesStatusPath = gamesDataDir + "/gamesStatus.json";

class StorageManager {
    constructor() {
        //gamesStatus = fs.readFileSync(gamesStatusPath).toString();
    }

    getGamesList() {
        const gamesList = Object.assign(gamesStatus, {});

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
        const gamePath = this.getGamePath(gameId);
        let matchId = 1;

        if ( gamesStatus[gameId] ) {
            matchId = gamesStatus[gameId].matchId;

            fs.readFile(gamePath, (err, matches) => {
                if (err) console.log(err);
    
                matches = JSON.parse(matches);
                matches[matchId] = game;
    
                fs.writeFile(gamePath, JSON.stringify(matches), (err) => {
                    if (err) console.log(err);
                    this.setGameStatus(gameId, game.status);
                });
            });

        } else {
            gamesStatus[gameId] = {
                status: game.status, // "start"
                matchId // 1
            };

            fs.writeFile(gamePath, JSON.stringify({ [matchId]: game }), (err) => {
                if (err) console.log(err);
            });
        }

        this.writeGameStatusFile();        
    }

    removeGame(gameId) {
        const gamePath = this.getGamePath(gameId);
        fs.unlinkSync(gamePath);
        this.removeGameStatus(gameId);
        this.writeGameStatusFile();
    }

    removeGameStatus(gameId) {
        delete gamesStatus[gameId];
    }

    setGameStatus(gameId, status) {
        if ( gamesStatus[gameId] ) {
            gamesStatus[gameId].status = status;
        } else {
            gamesStatus[gameId] = { status };
        }
    }

    writeGameStatusFile() {
        fs.writeFile(gamesStatusPath, JSON.stringify(gamesStatus), (err) => {
            if (err) console.log(err);
        });
    }

}

export default new StorageManager();