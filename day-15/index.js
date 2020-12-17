const input = [ 16, 11, 15, 0, 1, 7 ];

function speak( c, spoken, lastSpoken = null, getSpokenNumber ) {
    let spokenNumber = 0;
    if ( lastSpoken.length === 2 ) {
        spokenNumber =
            lastSpoken[ 1 ] -
            lastSpoken[ 0 ]; 
    }

    const current = spoken[ spokenNumber ];
    if ( ! current ) {
        spoken[ spokenNumber ] = [ c ];
    } else if ( current.length === 1 ) {
        current.push( c );
    } else {
        current[ 0 ] = current[ 1 ];
        current[ 1 ] = c;
    }

    if ( getSpokenNumber ) {
        return spokenNumber;
    }
    return spoken[ spokenNumber ];
}

function speakTimes( n ) {
    const spoken = {};
    for ( let i = 0; i < input.length; i++ ) {
        spoken[ input[ i ] ] = [ i ];
    }
    let lastSpoken = spoken[ input[ input.length - 1 ] ];

    for ( let i = input.length; i < n; i++ ) {
        lastSpoken = speak( i, spoken, lastSpoken, i === n - 1 );
    }
    return lastSpoken;
}

console.log( speakTimes( 2020 ) );
console.log( speakTimes( 30000000 ) );
