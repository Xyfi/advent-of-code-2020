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
    let row = 0, seat = 0, i = 0;
    currentInstruction = boardingPass[ i ];
    while ( currentInstruction === "F" || currentInstruction === "B" ) {
        row = row << 1;
        if ( currentInstruction === "B" ) {
            row++;
        }
        currentInstruction = boardingPass[ ++i ];
    }
    while( currentInstruction !== "" ) {
        seat = seat << 1;
        if ( currentInstruction === "R" ) {
            seat++;
        }
        currentInstruction = boardingPass.charAt( ++i );
    }

    return {
        seat,
        row,
        id: ( row * 8 + seat ),
    };
}