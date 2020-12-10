const makeLineReaderGenerator = require( "./lineReaderGenerator" );

module.exports = async ( path, processLine = null ) => {
    const lineReader = makeLineReaderGenerator( path );
    let result = await lineReader.next();

    const lines = [];

    while ( ! result.done ) {
        lines.push( processLine ? processLine( result.value ) : result.value );

        result = await lineReader.next();
    }

    return lines;
}
