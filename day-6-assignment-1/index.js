const path = require( "path" );
const makeLineReader = require( "../helpers/lineReaderGenerator" );

const lineReader = makeLineReader( path.resolve( "input.txt" ) );

let sum = 0;
( async () => {
    let result = await lineReader.next();
    let group = [];

    while ( true ) {
        if ( result.value === "" || result.done ) {
            sum += [ ...new Set( group.join( "" ) ) ].length;
            group = [];
            if ( result.done ) { break };
        } else {
            group.push( result.value );
        }
        result = await lineReader.next();
    }

    console.log( sum );
} )();
