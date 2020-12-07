const Bag = require( "./class-bag" );
const lineReader = require( "../../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "input.txt" ) );

function parseLine( line ) {
    // group 1: count, group 2: color
    const matches  = line.matchAll( /(?:(?<count>[0-9]+) )?(?<color>\w+ \w+) bag[s]?/g );

    let result = matches.next();
    
    let bag = result.value.groups;
    const data = { color: bag.color, contents: new Map() };

    result = matches.next();
    while ( ! result.done ) {
        bag = result.value.groups;
        if ( ! bag.count ) {
            break;
        }
        data.contents.set( bag.color, parseInt( bag.count, 10 ) );
        result = matches.next();
    }

    return data;
}

class BagRepository {
    static instance = null;

    constructor() {
        this.bags = new Map();
    }

    async init() {
        let result = await lineReader.next();
        while ( ! result.done ) {
            const line = result.value;
    
            const { color, contents } = parseLine( line );
            this.bags.set( color, new Bag( color, contents, this ) );
    
            result = await lineReader.next();
        }
    }

    get( color ) {
        return this.bags.get( color );
    }

    getAll() {
        return this.bags;
    }

    static getInstance() {
        if ( ! this.instance ) {
            this.instance = new BagRepository();
        }
        return this.instance;
    }
}

module.exports = BagRepository;
