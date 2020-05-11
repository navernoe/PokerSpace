import React from "react";
import { Link } from "react-router-dom";

function RemoveGame(props) {
    const removeGame = () => {
        props.ws.send(JSON.stringify({
            action: "removeGame",
            gameId: props.gameId
        }));
    };

    return (
        <div className="removeGame" onClick={ removeGame }>
            <img
                src="./images/removeGame.png"
                alt="removeGame"
            >          
            </img>
        </div>
    );
}

export default function(props) {
    const gamesList = props.gamesList;

    if ( !gamesList ) {
        return null;
    }

    const gamesLinks = Object.keys(gamesList).reduce((elements, gameId) => {
        const gameURL = "/game/" + gameId;

        const newGameLink = React.createElement(
            "li",
            { className: "gameLink" },
            [
                <Link to={ gameURL }>
                    { gameId }
                </Link>,
                <RemoveGame ws={ props.ws } gameId={ gameId }/>
            ]
        );

        return [...elements, newGameLink];
    }, []);

    const gamesListElement = React.createElement(
        "ul",
        { className: "gameList" },
        gamesLinks
    );


    return gamesListElement;
}