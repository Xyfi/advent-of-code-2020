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