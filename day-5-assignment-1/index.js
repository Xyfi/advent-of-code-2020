const { exit } = require("process");
const makeLineReader = require( "./lineReaderGenerator" );

const lineReader = makeLineReader();

( async () => {
    let result = await lineReader.next();
    let highestIdSeat = { id: 0 };
    while ( ! result.done ) {
        const seat = getSeat( result.value );
        if ( seat.id > highestIdSeat.id ) {
            highestIdSeat = seat;
        }
        result = await lineReader.next();
    }

    console.log( highestIdSeat );
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