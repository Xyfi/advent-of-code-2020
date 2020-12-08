const lineReader = require( "../../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "../shared/input.txt" ) );

function run( program ) {
    let acc = 0;

    const executed = {};

    let pos = 0;
    while ( ! executed[ pos ] ) {
        executed[ pos ] = true;
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

( async () => {
    let result = await lineReader.next();
    const program = [];

    while ( ! result.done ) {
        const line = await result.value;

        const operation = line.split( " " );
        operation[ 1 ] = parseInt( operation[ 1 ] );
        program.push( operation );

        result = await lineReader.next();
    }

    console.log( run( program ) );
} ) ();