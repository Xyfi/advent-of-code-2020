const input = require( "./input.json" );

let validCount = 0;
for (let i = 0; i < input.length; i++) {
    const { password, pos1, pos2, char } = input[i];

    const charAtPos1 = password.charAt( pos1 - 1 ),
        charAtPos2 = password.charAt( pos2 - 1 );

    if ( charAtPos1 === char ^ charAtPos2 === char) {
        validCount++;
    }
}

console.log( validCount + " valid passwords" );
