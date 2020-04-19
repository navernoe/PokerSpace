import React from "react";

function Card(props) {
    const cardSuit = props.card.suit;
    const cardFaceValue = props.card.faceValue;

    return (
        <li>{cardSuit} {cardFaceValue}</li>
    );
}


function Cards(props) {
    const cards = props.cards;

    if ( !cards ) {
        return [];
    }

    return cards.map(card => <Card card={card} />);
}

export default Cards;