const memoize = require( "../../helpers/memoize" );

class Bag {
    constructor( color, contents, bagRepo ) {
        this.color = color;
        this.contents = contents;
        this.repo = bagRepo;
        
        this.contains = memoize( this.contains );
        this.getInnerBagCount = memoize( this.getInnerBagCount );
    }

    contains( color ) {
        let count = this.contents.get( color ) || 0;

        for ( const contentsColor of this.contents.keys() ) {
            count += this.repo.get( contentsColor ).contains( color );
        }

        return count;
    }

    getInnerBagCount() {
        let innerBagCount = 0;

        for ( const  [ innerBagColor, nBags ] of this.contents.entries() ) {
            innerBagCount += ( nBags + ( nBags * this.repo.get( innerBagColor ).getInnerBagCount() ) );
        }

        return innerBagCount;
    }
}

module.exports = Bag;
