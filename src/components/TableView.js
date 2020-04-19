import React from "react";

export default function(props) {
    const tableCards = props.tableCards || [];
    const pot = props.pot;

    if ( !tableCards.length && !pot ) {
        return null;
    }

    const tableElements = tableCards.reduce((elements, card) => {
        return [
            ...elements,
            React.createElement(
                "div",
                {className: "tableCard"},
                `${card.suit} ${card.faceValue}`
            )
        ];
    }, [
        React.createElement(
            "div",
            {className: "pot"},
            `POT: ${pot}`
        )
    ]);

    return tableElements;
}