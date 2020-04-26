// import http from "http";
// import fs from "fs";
// import path from "path";
import WebSocket from "ws";
import Poker from "./classes/Poker.js";

/*
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
const games = {};
const players = [
        {
            name: "Player1"
        },
        {
            name: "Player2"
        },
        {
            name: "Player3"
        },
        {
            name: "Player4"
        }
];

server.on("connection", (ws) => {
    const actions = ["call", "raise", "fold", "check"];
    server.broadcast = (data, gameId) => {
        server.clients.forEach(client => {
            if ( client.gameId === gameId ) {
                client.send(data);
            }
        });
    };

    const newPlayer = {
        name: "Player5",
        isRealMan: true
    };
    players.push(newPlayer);

    ws.on("message", (data) => {
        data = JSON.parse(data);
        const gameId = ws.gameId;
        const action = data.action;
        let poker = games[gameId];

        if ( action === "join" ) {
            const requestGameId = data.gameId;

            if ( games[requestGameId] ) {
                poker = games[requestGameId];
            } else {
                poker = new Poker(players);
                games[requestGameId] = poker;
            }
            ws.gameId = requestGameId;
        }

        if ( action === "start" ) {
            poker.start();
        }

        if ( actions.includes(action) ) {
            const raiseSum = data.raiseSum;
            const playersManager = poker.playersManager;
            const playerInBetQueue = playersManager.playerInBetQueue;
            playersManager[action](playerInBetQueue, raiseSum);
            poker.goNextStep();
        }

        if ( action === "doBetsByBots" ) {
            poker.playersManager.doBet();
        }

        server.broadcast(JSON.stringify({
            poker
        }), ws.gameId);
    });
});
