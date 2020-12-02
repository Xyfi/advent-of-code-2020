const input = require( "./input.json" );

let validCount = 0;
for (let i = 0; i < input.length; i++) {
    const line = input[i];
    
    const count = ( line.string.match( new RegExp( line.char, "g" ) ) || [] ).length;

    if ( count >= line.min && count <= line.max ) {
        console.log( "Valid: " + line.line );
        validCount++;
    }
}

console.log( validCount + " valid passwords" );
