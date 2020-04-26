import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import Game from "./GameView";

class App extends Component {
	constructor(props) {
		super(props);
		this.ws = new WebSocket("ws://localhost:3000");
		this.ws.onopen = this.onConnectionOpen.bind(this);
		//this.ws.onmessage = this.onReceiveMsg.bind(this);
	}

	onConnectionOpen() {
		alert("Соединение установлено.");
	}

    render() {
      return (
        <Router>
          <div>
            <nav>
              <ul>
				<li>
					<Link to="/">Home</Link>
                </li>
                <li>
					<Link to="/game">Game</Link>
                </li>
              </ul>
          </nav>

          <Switch>
            <Route path="/game">
              <Game ws={this.ws}/>
            </Route>
          </Switch>
          </div>
        </Router>
      );
    }
}

export default App;