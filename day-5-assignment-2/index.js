const makeLineReader = require( "./lineReaderGenerator" );

const lineReader = makeLineReader();

( async () => {
    let result = await lineReader.next();
    let seatIds = [];
    while ( ! result.done ) {
        seatIds.push( getSeat( result.value ).id );
        result = await lineReader.next();
    }

    seatIds.sort();

    for (let i = 0; i < seatIds.length; i++) {
        const id = seatIds[i];
        if ( seatIds[ i + 1 ] === ( id + 2 ) ) {
            console.log( id + 1 );
            break;
        }
    }
} )();

function getSeat( boardingPass ) {
    let row = 0, seat = 0;

    row = parseInt( boardingPass.match( /^[FB]+/ )[0].replace( /[FB]{1}/g, c => c === "B" ? "1" : "0" ), 2 );
    seat = parseInt( boardingPass.match( /[RL]+/ )[0].replace( /[RL]{1}/g, c => c === "R" ? "1" : "0" ), 2 );

    return {
        seat,
        row,
        id: ( row * 8 + seat ),
    };
}
