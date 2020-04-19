import React from "react";
import Cards from "./CardsView";

export default function(props) {

    const players = props.players;

    if ( !players.length ) {
        return null;
    }

    const playersElements = players.reduce((elements, player) => {

        const infoClassName = player.isDealer ? { className: "player-info dealer" } : {className: "player-info"};
        const playerClassName = player.isWinner ? { className: "player winner" } : { className: "player" };

        const newPlayerEl = React.createElement(
            "div",
            playerClassName,
            [
                React.createElement(
                    "div",
                    infoClassName,
                    player.inQueue ? player.name + " >>" : player.name
                ),

                React.createElement(
                    "div",
                    {className: "player-cards"},
                    React.createElement(
                        "ul",
                        {className: ""},
                        <Cards cards={player.cards} />
                    )
                ),

                React.createElement(
                    "div",
                    {className: "player-bet"},
                    player.bet
                ),

                React.createElement(
                    "div",
                    {className: "player-bestcombination"},
                    React.createElement(
                        "ul",
                        {className: ""},
                        [
                            player.bestCombination ? "Best comb: " + player.bestCombination.name : "",
                            player.bestCombination ? <Cards cards={player.bestCombination.cards} /> : "",
                            player.bestCombination ? <Cards cards={player.bestCombination.highCards} /> : ""
                        ]
                    )
                ),

                React.createElement(
                    "div",
                    {className: "player-stack"},
                    "stack: " + player.chipsStack
                ),
            ]
        );

        return [...elements, newPlayerEl];
    }, []);

    return playersElements;
}