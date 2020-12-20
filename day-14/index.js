const lineReader = require( "../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "input.txt" ) );

const mem1 = {};
const mem2 = {};

( async () => {
    let result = await lineReader.next();

    let mask = {};

    while ( ! result.done ) {
        const instr = parseLine( result.value );

        if ( instr.type === "mask" ) {
            mask = instr.mask;
        } else {
            assignment1( mask, instr );
            assignment2( mask, instr );
        }
 
        result = await lineReader.next();
    }


    console.log( ( Object.values( mem1 ).reduce( ( acc, value ) => acc + value, 0n ) ).toString() );
    console.log( ( Object.values( mem2 ).reduce( ( acc, value ) => acc + value, 0n ) ).toString() );
} )();

function assignment1( strMask, { addr, value } ) {
    let mask = 0n;
    let maskValue = 0n;

    for ( let i = 0; i < strMask.length; i++ ) {
        const c = strMask[ i ];
        mask = mask << 1n;
        maskValue = maskValue << 1n;
        if ( c !== "X" ) {
            mask++;
        }
        if ( c === "1" ) {
            maskValue++;
        }
    }

    mem1[ addr ] = ( value & ~mask ) + ( maskValue & mask );
}

function assignment2( strMask, { addr, value } ) {
    const bitIndices = [];
    let floatingMask = 0n;
    let overwriteMask = 0n;

    for ( let i = 0; i < strMask.length; i++ ) {
        floatingMask = floatingMask << 1n;
        overwriteMask = overwriteMask << 1n;
        if ( strMask[ i ] === "X" ) {
            bitIndices.push( BigInt( strMask.length - i - 1 ) );
            floatingMask++;
        }
        if ( strMask[ i ] === "1" ) {
            overwriteMask++;
        }
    }

    const address = addr | overwriteMask;

    for ( let c = 0n; c < 2 ** bitIndices.length; c++ ) {
        let offsetCombination = 0n;
        for ( let bit = 0n; bit < bitIndices.length; bit++ ) {
            let isSet = ( c & 1n << bit ) !== 0n;
            let bitLocation = 1n << bitIndices[ bit ];
            if ( isSet ) {
                offsetCombination |= bitLocation;
            } else {
                offsetCombination &= ~bitLocation;
            }
        }

        let next = ( address & ~floatingMask ) + ( offsetCombination & floatingMask );
        mem2[ next ]= value;        
    }
}

function parseLine( line ) {
    if ( line.substr( 0, 4 ) === "mask" ) {
        return parseMask( line );
    }
    return parseMem( line );
}

function parseMask( line ) {
    return {
        type: "mask",
        replaceMask: 0,
        mask: /[0-9X]+$/.exec( line )[ 0 ],
    }
}

function parseMem( mem ) {
    const matches = mem.match( /mem\[(?<addr>[0-9]+)\] = (?<value>[0-9]+)/ );
    return {
        addr: BigInt( matches.groups.addr ),
        value: BigInt( matches.groups.value ),
    }
}
