import React from "react";
import Cards from "./CardsView";
import BestCombination from "./BestCombination";

export default function(props) {

    const players = props.players;

    if ( !players.length ) {
        return null;
    }

    const playersElements = players.reduce((elements, player) => {
        const infoClassName = player.isDealer ? "player-info dealer" : "player-info";
        const playerClassName = player.isWinner ? "player winner" : "player";

        const newPlayerEl = (
            <div key={player.name} className={playerClassName}>
                <div className={infoClassName}>
                    { player.inQueue ? player.name + " >>" : player.name }
                </div>

                <div className="player-cards">
                    <div className="Cards">
                        hand:
                        ------------------
                            <Cards cards={player.cards} />
                        ------------------
                    </div>
                </div>

                <div className="player-bet">
                    bet: { player.bet }
                </div>

                <BestCombination player={player} />

                <div className="player-stack">
                    stack: { player.chipsStack }
                </div>
            </div>
        );

        return [...elements, newPlayerEl];
    }, []);

    return playersElements;
}