const path = require( "path" );
const makeLineReader = require( "../helpers/lineReaderGenerator" );

const lineReader = makeLineReader( path.resolve( "input.txt" ) );

function getSharedAnswers( group ) {
    let shared = 0;
    for (let i = 0; i < group[ 0 ].length; i++) {
        const char = group[ 0 ][i];
        for (let j = 1; j <= group.length; j++) {
            if ( j === group.length ) {
                shared++; break;
            }
            if ( ! group[ j ].includes( char ) ) {
                break;
            }
        }
    }
    return shared;
}

let sum = 0;
( async () => {
    let result = await lineReader.next();
    let group = [];

    while ( true ) {
        if ( result.value === "" || result.done ) {
            sum += getSharedAnswers( group );
            group = [];
            if ( result.done ) { break };
        } else {
            group.push( result.value );
        }
        result = await lineReader.next();
    }

    console.log( sum );
} )();
