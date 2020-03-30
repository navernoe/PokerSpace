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

        const trips = this.checkSet(cards);
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

        const highCard = this.chooseHighCard(cards);
        return highCard;
    },

    checkTwoPair(cards) {
        // checkTwoPair will be here
    },

    checkPair(cards) {

        let groups = [];
        const weightGroups = _.groupBy(cards, "weight");

        Object.keys(weightGroups).forEach((key) => {
            groups.push(weightGroups[key]);
        });

        const [pair] = groups.filter(group => group.length === 2);

        if ( !pair ) {

            return false;
        }

        const remainingCards = cards.filter(card => card.weight !== pair[0].weight);
        const sortedCardsWithoutPair = _.sortBy(remainingCards, "weight");
        const lastHighCards = sortedCardsWithoutPair.splice(sortedCardsWithoutPair.length - 4, 3);

        return {
            name: "Pair",
            cards: [...pair, ...lastHighCards]
        }

    },

    checkRoyalFlush(cards) {
        const straightFlush = this.checkStraightFlush(cards);

        if ( !straightFlush ) {

            return false;
        }

        const highCard = _.maxBy(straightFlush, "weight");

        if ( highCard.weight === 14 ) {

            return true;

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

        if ( !straightFlushGroups ) {
            return false;
        }

        return {
            name: "StraightFlush",
            cards: _.maxBy(straightFlushGroups, (group) => _.maxBy(group, "weight"))
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
            cards: bestStraight
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
            cards: bestFlush
        };
    }

};