const lineReader = require( "../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "input.txt" ) );

const mem = [].fill( 0, 0, 2 ** 16 );

( async () => {
    let result = await lineReader.next();

    let mask = {};

    while ( ! result.done ) {
        const instr = parseLine( result.value );

        if ( instr.type === "mask" ) {
            mask = instr;
        } else {
            applyMask( instr.addr, instr.value, mask );
        }

        result = await lineReader.next();
    }

    console.log( ( mem.reduce( ( acc, value ) => acc + value, 0n ) ).toString() );
} )();

function parseLine( line ) {
    if ( line.substr( 0, 4 ) === "mask" ) {
        return parseMask( line );
    }
    return parseMem( line );
}

function parseMask( line ) {
    const result = {
        type: "mask",
        replaceMask: BigInt( 0 ),
        mask: BigInt( 0 ),
    }
    const mask = /[0-9X]+$/.exec( line );
    for ( let i = 0; i < mask.length; i++ ) {
        result.mask = result.mask << 1n;
        result.replaceMask = result.replaceMask << 1n;
        if ( mask[ i ] !== "X" ) {
            result.mask++;
        }
        if ( mask[ i ] === "1" ) {
            result.replaceMask++;
        }
    }
    return result;
}

function parseMem( mem ) {
    const matches = mem.match( /mem\[(?<addr>[0-9]+)\] = (?<value>[0-9]+)/ );
    return {
        addr: BigInt( matches.groups.addr ),
        value: BigInt( matches.groups.value ),
    }
}

function applyMask( addr, n, mask ) {
    mem[ addr ] = ( n & ~mask.mask ) + ( mask.replaceMask & mask.mask );
}
