const lineReader = require( "../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "input.txt" ) );

async function processFile() {
    let result = await lineReader.next();
    
    const data = {
        fields: {},
    };
    
    while ( result.value !== "" ) {
        const { groups: { field, r1n1, r1n2, r2n1, r2n2 } } = /^(?<field>[\w ]+): (?<r1n1>\d+)-(?<r1n2>\d+) or (?<r2n1>\d+)-(?<r2n2>\d+)$/.exec( result.value );
        data.fields[ field ] = [ [ r1n1, r1n2 ], [ r2n1, r2n2 ] ];
        result = await lineReader.next();
    }

    result = await lineReader.next();

    console.log( JSON.stringify( data ) );
}

processFile();
