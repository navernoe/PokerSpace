import React from "react";
import Cards from "./CardsView";

export default function(props) {
    const tableCards = props.tableCards || [];
    const pot = props.pot;

    if ( !tableCards.length && !pot ) {
        return null;
    }

    const tableElements = (
        <div className="Table">
            <div className="pot">
                POT: { pot }
            </div>
            <div className="Cards">
                <Cards cards={tableCards} />
            </div>
        </div>
    );

    return tableElements;
}