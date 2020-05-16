import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

import Game from "./GameView";
import GamesList from "./GamesListView";

const playerName = "testPlayerName";

class App extends Component {
	constructor(props) {
		super(props);
		this.ws = new WebSocket("ws://localhost:3000");
		this.ws.onmessage = this.onReceiveMsg.bind(this);
		this.state = {
			gamesList: {}
		}
	}

	onReceiveMsg({data}) {
		const dataObj = JSON.parse(data);

		if ( dataObj.msgTag === "newGame" ) {
			const currentGamesList = this.getCurrentGamesList();
			currentGamesList[ dataObj.gameId ] = dataObj.newGame;
			this.setState({ gamesList: currentGamesList });
		}

		if ( dataObj.msgTag === "updatedGamesList" ) {
			this.setState({ gamesList: dataObj.gamesList });
		}

		if ( dataObj.msgTag === "error" ) {
			console.log(dataObj.error);
		}
	}

	getCurrentGamesList() {
		return this.state.gamesList;
	}
  
	createNewGame() {
		const gameId = playerName + Date.now();

		this.ws.send(JSON.stringify({
			action: "createNewGame",
			gameId
		}));
	}

    render() {
      return (
        <div>
			<Router>
			<div>
				<nav>
					<GamesList gamesList={this.getCurrentGamesList()} ws={this.ws}/>
				</nav>

				<Switch>
					<Route
						path="/game/:game_id"
						render={(props)=> <Game ws={this.ws} {...props} />}
					>
					</Route>
				</Switch>

			</div>
			</Router>

        	<button className = "createBtn" onClick = {this.createNewGame.bind(this)} >Create New Game</button>
        </div>
      );
    }
}

export default App;