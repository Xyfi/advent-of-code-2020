const { LOADIPHLPAPI } = require("dns");
const readFile = require( "../helpers/readFile" );

( async () => {
    const adapters = await readFile(
        require( "path" ).resolve( __dirname, "./input.txt" ),
        line => parseInt( line, 10 )
    );

    adapters.sort( ( a, b ) => a - b );
    // Outlet
    adapters.unshift( 0 );
    // Device
    adapters.push( adapters[ adapters.length - 1 ] + 3 );

    const differences = { 1: 0, 3: 0 };

    for (let i = 0; i < adapters.length - 1; i++) {
        const diff = adapters[ i + 1 ] - adapters[ i ];
        differences[ diff ]++
    }

    console.log( differences[ 1 ] * differences[ 3 ] );

    console.log( getTotalCombinations( adapters, 3 ) );
} )();

const cache = {};
function getTotalCombinations( adapters, maxStep, index = 0 ) {
    if ( cache[ index ] ) {
        return cache[ index ];
    }
    if ( index === adapters.length - 1 ) {
        return 1;
    }

    const currentValue = adapters[ index ];
    let step = 1;
    let total = 0;
    while ( adapters[ index + step ] <= currentValue + maxStep ) {
        total += getTotalCombinations( adapters, maxStep, index + step );
        step++;
    }

    cache[ index ] = total;

    return total;
}


