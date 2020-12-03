const numbers = require( "./input.json" );

for (let i = 0; i < numbers.length; i++) {
    const n1 = numbers[i];

    const n2 = numbers.find( val => val !== n1 && ( val + n1 ) === 2020 ); 

    if ( ! n2 ) {
        continue;
    }

    console.log( n1, n2, n1 * n2 );
    break;
}
