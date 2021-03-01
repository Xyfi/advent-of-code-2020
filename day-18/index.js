const lineReader = require( "../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "input.txt" ) );

( async () => {
    let result = await lineReader.next();
    let answer = 0;
    let answer2 = 0;

    const parser = new ExpressionParser();

    while( ! result.done ) {
        const parsed = parser.parse( result.value );
        answer += solve( parsed );
        answer2 += solve( parsed, [ [ "+" ], [ "*" ] ] );

        result = await lineReader.next();
    }

    console.log( "Assignment 1 answer: " + answer );
    console.log( "Assignment 2 answer: " + answer2 );
} )();

class ExpressionParser {
    constructor() {
        this.cache = {};
    }

    parse( expression ) {
        this._expression = expression.split( " " ).join( "" );
        this._index = 0;

        return this._parseInner();
    }

    _parseInner() {
        const arr = [];

        arr.push( this._parseValue() );

        while ( true ) {
            const next = this._getNext();
            if ( next === null || next === ")" ) {
                break;
            }
            // Expect operator
            arr.push( next );
            // Expect value
            arr.push( this._parseValue() );
        }

        return arr;
    }

    _parseValue() {
        const next = this._getNext();
        // Check for group.
        if ( next === "(" ) {
            return this._parseInner( true );
        }
        // Expect value.
        return parseInt( next, 10 );
    }

    _getNext() {
        if ( ! this._expression[ this._index ] ) {
            return null;
        }
        return this._expression[ this._index++ ];
    }
}

const defaultPrecedence = [
    [ "*", "+" ],
];

const apply = {
    "*": ( a, b ) => a * b,
    "+": ( a, b ) => a + b,
}

function solve( parsed, precedence = defaultPrecedence ) {
    // Solve groups
    parsed = parsed.map( v => Array.isArray( v ) ? solve( v, precedence ) : v );

    precedence.forEach( p => {
        for ( let i = 1; i < parsed.length; i += 2 ) {
            const operator = parsed[ i ];
            if ( p.includes( operator ) ) {
                parsed[ i ] = apply[ operator ]( parsed[ i - 1 ], parsed[ i + 1 ] );
                parsed[ i - 1 ] = null;
                parsed[ i + 1 ] = null;
                parsed = parsed.filter( v => v !== null );
                i -= 2;
            }
        }
    } );

    if ( parsed.length !== 1 ) {
        console.log( "OH NO!" );
    }

    return parsed[ 0 ];
}
