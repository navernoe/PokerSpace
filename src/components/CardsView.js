import React from "react";

function Card(props) {
    const cardSuit = props.card.suit;
    const cardFaceValue = props.card.faceValue;

    return (
        <div className="Card">{cardSuit} {cardFaceValue}</div>
    );
}


function Cards(props) {
    const cards = props.cards;

    if ( !cards ) {
        return [];
    }

    return cards.map((card) => {
        const cardKey = `${card.suit}${card.faceValue}`;
        return <Card key={cardKey} card={card} />
    });
}

export default Cards;