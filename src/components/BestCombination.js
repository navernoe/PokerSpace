import React from "react";
import Cards from "./CardsView";

export default function(props) {
    const player = props.player;

    if ( player.bestCombination ) {

        return (
            <div className="player-bestcombination">
                Best comb: { player.bestCombination.name }
                <div className="Cards">
                    <Cards cards={player.bestCombination.cards} />
                    <Cards cards={player.bestCombination.highCards} />
                </div>
            </div>
        );
    } else {

        return null;
    }
}