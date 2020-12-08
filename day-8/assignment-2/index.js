const lineReader = require( "../../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "../shared/input.txt" ) );

function run( program ) {
    let acc = 0;
    let pos = 0;

    const trace = [];
    const executed = {};

    while ( pos !== program.length ) {
        if ( executed[ pos ] || pos > program.length ) {
            throw {
                message: "Program is corrupt",
                trace,
                acc,
            }
        }

        executed[ pos ] = true;
        trace.push( pos );
        const operation = program[ pos ];

        switch( operation[ 0 ] ) {
            case "acc":
                acc += operation[ 1 ]; pos++; break;
            case "jmp":
                pos += operation[ 1 ]; break;
            default:
                pos++; break;
        }
    }

    return acc;
}

function fixCorruption( program, trace ) {
    let pos;

    while ( trace.length > 0 ) {
        pos = trace.pop();
        if ( ! [ "jmp", "nop" ].includes( program[ pos ][ 0 ] ) ) {
            continue;
        }
        const copy = JSON.parse( JSON.stringify( program ) );
        
        const opCode = copy[ pos ][ 0 ];
        copy[ pos ][ 0 ] = opCode === "jmp" ? "nop" : "jmp";

        try {
            run( copy );

            return copy;
        } catch ( e ) {
            continue;
        }
    }

    return false;
}

( async () => {
    let result = await lineReader.next();
    let program = [];

    while ( ! result.done ) {
        const line = await result.value;

        const operation = line.split( " " );
        operation[ 1 ] = parseInt( operation[ 1 ] );
        program.push( operation );

        result = await lineReader.next();
    }

    try {
        console.log( run( program ) );
    } catch( e ) {
        program = fixCorruption( program, e.trace );
    }

    if ( program ) {
        console.log( run( program ) );
    }
} ) ();