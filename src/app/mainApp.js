// import http from "http";
// import fs from "fs";
// import path from "path";
import WebSocket from "ws";
import Poker from "./classes/Poker.js";
import StorageManager from "./classes/StorageManager.js";

/*  try to create own http-server

http.createServer((req, res) => {
    //console.log("___dirname ", __dirname);
    const url = req.url;
    //res.setHeader("Location", url);

    //if ( url == "/" ) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        const currentDir = path.resolve();
        const absolutePath = path.join(currentDir, "/dist/index.html");
        fs.createReadStream(absolutePath).pipe(res);
        // fs.readFile(absolutePath, ( error, data ) => {

        //     if ( error ) {
        //         res.statusCode = 404;
        //         res.end("Resourse not found!");
        //     }
        //     else {
        //          res.writeHead(200, {'Content-Type': 'text/html'});
        //         res.end(data);
        //     }
        // });
   // } else {
        //res.end();
   //}
}).listen(8080);

*/

const server = new WebSocket.Server({ port: 3000 });
const gamesList = StorageManager.getGamesList();
const players = [
    { name: "Player1" },
    { name: "Player2" },
    { name: "Player3" },
    { name: "Player4" }
];
let newPlayerId = 5;
let currentWS;

function addNewPlayer() {
    newPlayerId++;
    const newPlayer = {
        name: "Player" + newPlayerId,
        isRealMan: true
    };
    players.push(newPlayer);
}

function updateGamesList() {
    currentWS.send(JSON.stringify({
        gamesList,
        msgTag: "updatedGamesList"
    }));
};

function createNewGame(newGameId) {
    const poker = new Poker({ players });
    gamesList[ newGameId ] = poker;
    StorageManager.writeGame(poker, newGameId);
}

function removeGame(gameId) {
    StorageManager.removeGame(gameId);
    delete gamesList[ gameId ];
}

function loadGame(gameId) {
    let game;
    const isGameExists = StorageManager.isGameExists(gameId);

    if ( isGameExists ) {
        const gameData = StorageManager.getGame(gameId);
        game = new Poker(gameData);
    }

    return game;
}

server.broadcast = (data, gameId) => {
    server.clients.forEach(client => {
        if ( client.gameId === gameId ) {
            client.send(data);
        }
    });
};

server.on("connection", (ws) => {
    currentWS = ws;
    addNewPlayer();

    ws.on("message", (data) => {
        data = JSON.parse(data);
        const gameId = ws.gameId;
        const action = data.action;
        let poker = gamesList[gameId];

        // if ( poker && !(poker instanceof Poker) ) {
        //     poker = new Poker(poker);
        //     gamesList[gameId] = poker;
        // }

        switch( action ) {
            case "updateGamesList": {
                updateGamesList();
                return;
            }
            case "createNewGame": {
                const newGameId = data.gameId;
                createNewGame(newGameId);
                updateGamesList();
                return;
            }
            case "loadGame": {
                const requestGameId = data.gameId;
                poker = loadGame(requestGameId);
                poker = new Poker(poker);
                gamesList[requestGameId] = poker;
                ws.gameId = requestGameId;
                break;
            }
            case "start": {
                poker.start();
                StorageManager.writeGame(poker, gameId);
                break;
            }
            case "doBetByBot": {
                poker.playersManager.doBet();
                StorageManager.writeGame(poker, gameId);
                break;
            }
            case "removeGame": {
                const requestGameId = data.gameId;
                removeGame(requestGameId);
                updateGamesList();
                return;
            }
            case "check":
            case "call":
            case "raise":
            case "fold": {
                const raiseSum = data.raiseSum;
                const playersManager = poker.playersManager;
                const playerInBetQueue = playersManager.playerInBetQueue;
                playersManager[action](playerInBetQueue, raiseSum);
                poker.goNextStep();
                StorageManager.writeGame(poker, gameId);
                break;
            }
            default: break;
        }

        server.broadcast(JSON.stringify({
            poker
        }), ws.gameId);
    });
});


