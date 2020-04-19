import _ from "lodash";

export default {

    combinationsWeights: {
        RoyalFlush: 10,
        StraightFlush: 9,
        Quads: 8,
        FullHouse: 7,
        Flush: 6,
        Straight: 5,
        Trips: 4,
        TwoPairs: 3,
        Pair: 2,
        HighCards: 1
    },

    findBestCombination(cards) {

        const royalFlush = this.checkRoyalFlush(cards);
        if ( royalFlush ) {
            return royalFlush;
        }

        const straightFlush = this.checkStraightFlush(cards);
        if ( straightFlush ) {
            return straightFlush;
        }

        const quads = this.checkQuads(cards);
        if ( quads ) {
            return quads;
        }

        const fullHouse = this.checkFullHouse(cards);
        if ( fullHouse ) {
            return fullHouse;
        }

        const flush = this.checkFlush(cards);
        if ( flush ) {
            return flush;
        }

        const straight = this.checkStraight(cards);
        if ( straight ) {
            return straight;
        }

        const trips = this.checkTrips(cards);
        if ( trips ) {
            return trips;
        }

        const twoPairs = this.checkTwoPairs(cards);
        if ( twoPairs ) {
            return twoPairs;
        }

        const pair = this.checkPair(cards);
        if ( pair ) {
            return pair;
        }

        const highCards = this.getHighCards({
            cards,
            count: 5
        });
        return {
            name: "HighCards",
            cards: highCards,
            weight: this.combinationsWeights.HighCards
        };
    },


    getHighCards({cards, count, excludeCards}) {

        if ( excludeCards ) {
            cards = _.differenceWith(cards, excludeCards, _.isEqual);
        }

        const sortedCards = _.sortBy(cards, "weight");
        const uniqSortedCards = _.sortedUniqBy(sortedCards, "weight");
        const startToSplice = uniqSortedCards.length - count;
        const highCards = uniqSortedCards.splice(startToSplice, count);

        return highCards;
    },


    checkByWeight(cards) {
        let resultCombination;
        let groups = [];
        const weightGroups = _.groupBy(cards, "weight");

        Object.keys(weightGroups).forEach((key) => {
            groups.push(weightGroups[key]);
        });

        let quads = groups.filter((group) => group.length === 4);

        if ( quads.length ) {
            quads = _.sortBy(quads, (quad) => quad[0]);
            const bestQuads = quads[quads.length - 1];
            const highCards = this.getHighCards({
                cards,
                count: 1,
                excludeCards: bestQuads
            });

            resultCombination = {
                name: "Quads",
                cards: bestQuads,
                highCards
            };
            resultCombination.weight = this.getCombinationWeight(resultCombination);
            return resultCombination;
        }

        let trips = groups.filter((group) => group.length === 3);
        let pairs = groups.filter((group) => group.length === 2);

        if ( trips.length && pairs.length ) {
            trips = _.sortBy(trips, (trip) => trip[0]);
            pairs = _.sortBy(pairs, (pair) => pair[0]);

            const bestTrip = trips[trips.length - 1];
            const bestPair = pairs[pairs.length - 1];
            const bestFullHouse = [...bestTrip, ...bestPair];

            resultCombination = {
                name: "FullHouse",
                cards: bestFullHouse
            };
            resultCombination.weight = this.getCombinationWeight(resultCombination);
            return resultCombination;
        }

        if ( trips.length ) {
            trips = _.sortBy(trips, (trip) => trip[0]);
            const bestTrip = trips[trips.length - 1];
            const highCards = this.getHighCards({
                cards,
                count: 2,
                excludeCards: bestTrip
            });

            resultCombination = {
                name: "Trips",
                cards: trips[trips.length - 1],
                highCards
            };
            resultCombination.weight = this.getCombinationWeight(resultCombination);
            return resultCombination;
        }

        if ( pairs.length ) {
            pairs = _.sortBy(pairs, (pair) => pair[0]);

            if ( pairs.length > 1 ) {
                const bestTwoPairs = pairs.splice(pairs.length - 2, 2);
                const bestTwoPairsCards = _.flatten(bestTwoPairs);
                const highCards = this.getHighCards({
                    cards,
                    count: 1,
                    excludeCards: bestTwoPairsCards
                });

                resultCombination = {
                    name: "TwoPairs",
                    cards: bestTwoPairsCards,
                    highCards
                };
                resultCombination.weight = this.getCombinationWeight(resultCombination);
                return resultCombination;
            }

            const bestPair = pairs[pairs.length - 1];
            const highCards = this.getHighCards({
                cards,
                count: 3,
                excludeCards: bestPair
            })

            resultCombination = {
                name: "Pair",
                cards: bestPair,
                highCards
            };
            resultCombination.weight = this.getCombinationWeight(resultCombination);
            return resultCombination;
        }

        return false;
    },


    checkQuads(cards) {
        const resultByWeight = this.checkByWeight(cards);

        if ( resultByWeight && resultByWeight.name === "Quads" ) {
            return resultByWeight;
        }

        return false;

    },


    checkFullHouse(cards) {
        const resultByWeight = this.checkByWeight(cards);

        if ( resultByWeight && resultByWeight.name === "FullHouse" ) {
            return resultByWeight;
        }

        return false;

    },


    checkTrips(cards) {
        const resultByWeight = this.checkByWeight(cards);

        if ( resultByWeight && resultByWeight.name === "Trips" ) {
            return resultByWeight;
        }

        return false;

    },


    checkTwoPairs(cards) {
        const resultByWeight = this.checkByWeight(cards);

        if ( resultByWeight && resultByWeight.name === "TwoPairs" ) {
            return resultByWeight;
        }

        return false;
    },


    checkPair(cards) {
        const resultByWeight = this.checkByWeight(cards);

        if ( resultByWeight && resultByWeight.name === "Pair" ) {
            return resultByWeight;
        }

        return false;

    },


    checkRoyalFlush(cards) {
        const straightFlush = this.checkStraightFlush(cards);

        if ( !straightFlush ) {

            return false;
        }

        const highCard = _.maxBy(straightFlush, "weight");

        if ( highCard.weight === 14 ) {

            return {
                name: "RoyalFlush",
                weight: this.combinationsWeights.RoyalFlush
            };

        } else {

            return false;
        }
    },


    checkStraightFlush(cards) {
        let resultCombination;
        let groups = [];
        const suitsGroups = _.groupBy(cards, (card) => card.suit);

        Object.keys(suitsGroups).forEach((key) => {
            groups.push(suitsGroups[key]);
        });

        groups = groups.filter(group => group.length >= 5);

        if ( !groups.length ) {
            return false;
        }

        let straightFlushGroups = groups.map((group) =>
            this.checkStraight(group)
        );

        straightFlushGroups = straightFlushGroups.filter(group => group);

        if ( !straightFlushGroups.length ) {
            return false;
        }

        resultCombination = {
            name: "StraightFlush",
            cards: _.maxBy(straightFlushGroups, (group) => _.maxBy(group, "weight"))
        };
        resultCombination.weight = this.getCombinationWeight(resultCombination);

        return resultCombination;

    },


    checkStraight(cards) {

        const sortedCards = _.sortBy(cards, "weight");
        const uniqSortedCards = _.sortedUniqBy(sortedCards, "weight");
        const uniqCount = uniqSortedCards.length;

        let resultCombination;
        let chunkInd = 0;
        let currentCardWeight = uniqSortedCards[0].weight;
        let chunks = [[]];

        for (let i = 0; i < uniqCount; i++) {

            const card = uniqSortedCards[i];
            const weight = card.weight;

            if ( weight - currentCardWeight > 1 ) {
                chunks[++chunkInd] = [];
            }

            chunks[chunkInd].push(card);
            currentCardWeight = weight;
        }

        chunks = chunks.filter(chunk => chunk.length >= 5);

        if ( !chunks.length ) {
            return false;
        }

        let bestStraight = chunks[chunks.length - 1];
        bestStraight.splice(0, bestStraight.length - 5);

        resultCombination = {
            name: "Straight",
            cards: bestStraight
        };
        resultCombination.weight = this.getCombinationWeight(resultCombination);

        return resultCombination;
    },


    checkFlush(cards) {

        let flush = [];
        let groups = [];
        let resultCombination;
        const suitsGroups = _.groupBy(cards, (card) => card.suit);

        Object.keys(suitsGroups).forEach((key) => {
            groups.push(suitsGroups[key]);
        });

        groups = groups.filter(group => group.length >= 5);

        if ( !groups.length ) {
            return false;
        }

        if ( groups.length === 1 ) {
            flush = _.sortBy(groups[0], "weight");
            flush.splice(0, flush.length - 5);
            resultCombination = {
                name: "Flush",
                cards: flush
            }
            resultCombination.weight = this.getCombinationWeight(resultCombination);
            return resultCombination;
        }

        // если всего 7 карт (2 в руке и 5 на столе) -
        // то такой ситуации не должно быть =)
        let bestFlush = _.maxBy(groups, (group) => _.maxBy(group, "weight"));
        bestFlush.splice(0, bestFlush.length - 5);

        resultCombination = {
            name: "Flush",
            cards: bestFlush
        }
        resultCombination.weight = this.getCombinationWeight(resultCombination);
        return resultCombination;
    },

    getCombinationWeight({name, cards, highCards}) {
        let resultWeight;
        let sortedCards = [];

        if ( highCards ) {
            sortedCards = _.sortBy(highCards, "weight");
        }

        const getCardsWeight = (cards) => {
            let divider = 100;
            let cardWeights = 0;
            let card;
            let i = 0;

            while ( i < cards.length ) {
                card = cards[i];
                cardWeights += ( card.weight / divider );

                i++;
                divider *= divider;
            }

            return cardWeights;
        };

        switch(name) {
            case "Pair":
            case "Trips":
            case "Quads": {
                const combinationCard = cards[0];
                sortedCards.push(combinationCard);
                break;
            }

            case "TwoPairs": {
                const firstPairCard = cards[0];
                const secondPairCard = cards[2];
                sortedCards.push(secondPairCard, firstPairCard);
                break;
            }

            case "FullHouse": {
                const tripsCard = cards[0];
                const pairCard = cards[3];
                sortedCards.push(pairCard, tripsCard);
                break;
            }

            default: {
                sortedCards = cards;
                break;
            }

        }

        sortedCards.reverse();
        resultWeight = getCardsWeight(sortedCards) + this.combinationsWeights[name];

        return resultWeight;
    }

};