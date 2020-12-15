const lineReader = require( "../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "input.txt" ) );

( async () => {
    const departureTime = parseInt( ( await lineReader.next() ).value, 10 );
    
    let busses = ( await lineReader.next() ).value
        .split( "," )
        .map( ( bus, index ) => {
            if ( bus === "x" ) {
                return { line: "x" }
            }
            const line = parseInt( bus, 10 );
            return {
                line,
                index,
                departsIn: line - ( departureTime % line ),
            }
        } )
        .filter( bus => bus.line !== "x" );

    const busWithLargestInterval = busses.reduce( ( acc, val ) => {
        return val.line > acc.line ? val : acc;
    }, { line: 0 } );

    busses.sort( ( a, b ) => b.line - a.line );

    let answer;
    let currentDepartureTime = - busWithLargestInterval.index;
    let t = 0;
    while ( true ) {
        currentDepartureTime += busWithLargestInterval.line;
        answer = followUp( currentDepartureTime, busses );
        if ( answer ) {
            break;
        }
        if ( currentDepartureTime > t ) {
            t += 100000000000;
            console.log( currentDepartureTime );
            console.log( "100000000000000" );
        }
    }

    const earliestBus = busses.reduce( ( earliest, bus ) => {
        if ( bus === "x" ) { return earliestBus; }
        return ( bus.departsIn < earliest.departsIn ) ? bus : earliest;
    }, { departsIn: Infinity } );
    
    console.log( `Assignment 1: ${ earliestBus.line * earliestBus.departsIn }` );
    console.log( `Assignment 2: ${ answer }` );
} )();

function followUp( firstBusDepartureTime, busses ) {
    for ( let i = 1; i < busses.length; i++ ) {
        const bus = busses[ i ];
        const t = firstBusDepartureTime + bus.index;
        if ( t % bus.line !== 0 ) {
            return false;
        }
    }
    return firstBusDepartureTime;
}
