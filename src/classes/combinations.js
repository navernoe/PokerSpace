export default {

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
            weight: 1
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

            return {
                name: "Quads",
                cards: bestQuads,
                highCards,
                weight: 8
            };
        }

        let trips = groups.filter((group) => group.length === 3);
        let pairs = groups.filter((group) => group.length === 2);

        if ( trips.length && pairs.length ) {
            trips = _.sortBy(trips, (trip) => trip[0]);
            pairs = _.sortBy(pairs, (pair) => pair[0]);

            const bestTrip = trips[trips.length - 1];
            const bestPair = pairs[pairs.length - 1];
            const bestFullHouse = [...bestTrip, ...bestPair];

            return {
                name: "FullHouse",
                cards: bestFullHouse,
                weight: 7
            };
        }

        if ( trips.length ) {
            trips = _.sortBy(trips, (trip) => trip[0]);
            const bestTrip = trips[trips.length - 1];
            const highCards = this.getHighCards({
                cards,
                count: 2,
                excludeCards: bestTrip
            });

            return {
                name: "Trips",
                cards: trips[trips.length - 1],
                highCards,
                weight: 4
            };
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

                return {
                    name: "TwoPairs",
                    cards: bestTwoPairsCards,
                    highCards,
                    weight: 3
                };
            }

            const bestPair = pairs[pairs.length - 1];
            const highCards = this.getHighCards({
                cards,
                count: 3,
                excludeCards: bestPair
            })

            return {
                name: "Pair",
                cards: bestPair,
                highCards,
                weight: 2
            }
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
                weight: 10
            };

        } else {

            return false;
        }
    },


    checkStraightFlush(cards) {

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

        return {
            name: "StraightFlush",
            cards: _.maxBy(straightFlushGroups, (group) => _.maxBy(group, "weight")),
            weight: 9
        };
    },


    checkStraight(cards) {

        const sortedCards = _.sortBy(cards, "weight");
        const uniqSortedCards = _.sortedUniqBy(sortedCards, "weight");
        const uniqCount = uniqSortedCards.length;

        let chunkInd = 0;
        let currentCardWeight = uniqSortedCards[0].weight;
        let chunks = [[]];

        for (let i =0; i < uniqCount; i++) {

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

        return {
            name: "Straight",
            cards: bestStraight,
            weigth: 5
        };
    },


    checkFlush(cards) {

        let flush = [];
        let groups = [];
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
            return flush;
        }

        // если всего 7 карт (2 в руке и 5 на столе) -
        // то такой ситуации не должно быть =)
        let bestFlush = _.maxBy(groups, (group) => _.maxBy(group, "weight"));
        bestFlush.splice(0, bestFlush.length - 5);

        return {
            name: "Flush",
            cards: bestFlush,
            weight: 6
        };
    }

};