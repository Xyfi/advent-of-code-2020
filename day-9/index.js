const lineReader = require( "../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "./input.txt" ) );

async function getNextNumber() {
    return parseInt( ( await lineReader.next() ).value, 10 );
}

function findSum( numbers, sum, offset ) {
    for (let i = offset; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
            if ( numbers[ i ] + numbers[ j ] === sum ) {
                return true;
            }
        }
    }
    return false;
}

function findContiguousSetThatSumsUpTo( numbers, requiredSum ) {
    let startRange = 0, endRange = 1, sum = 0;
    let incrementing = true;

    sum = numbers[ startRange ] + numbers[ endRange ];

    while ( sum !== requiredSum ) {
        if ( sum < requiredSum ) {
            if ( ! incrementing ) { incrementing = true };
            const add = numbers[ ++endRange ];
            // If the next number is bigger than the required sum, no need to look further, start looking again after this number.
            if ( add >= requiredSum ) {
                startRange = endRange + 1;
                endRange = endRange + 2;
                sum = numbers[ startRange ] + numbers[ endRange ];
                continue;
            }
            sum += add;
        } else {
            // If the last action was an increment, first offset the start of the range by 1, then start offsetting the end range by -1.
            if ( incrementing ) {
                sum -= numbers[ startRange++ ];
                incrementing = false;
                continue;
            }
            sum -= numbers[ endRange-- ];
        }
    }

    return numbers.slice( startRange, endRange + 1 );
}

function oldFindContiguousSetThatSumsUpTo( numbers, requiredSum ) {
    for (let i = 0; i < numbers.length; i++) {
        let end = i, sum = numbers[ i ];
        while ( ( sum += numbers[ ++end ] ) < requiredSum ) {}
        if ( sum === requiredSum ) {
            return numbers.slice( i, end + 1 );
        }
    }
}

( async ( preamble ) => {
    const numbers = [];
    while ( numbers.length < preamble ) {
        numbers.push( await getNextNumber() );
    }

    let sum = await getNextNumber();

    while ( findSum( numbers, sum, numbers.length - preamble ) ) {
        numbers.push( sum );
        sum = await getNextNumber();
    }

    console.log( "Answer assignment 1:", sum );

    let start = process.hrtime();
    const set = findContiguousSetThatSumsUpTo( numbers, sum );
    let end = process.hrtime( start );
    set.sort();

    console.info( "Execution time assignment 2 (new solution): %ds %dms", end[0], end[1] / 1000000 );
    console.log( "Answer assignment 2 (new solution):", set[ 0 ] + set[ set.length - 1] );

    start = process.hrtime();
    const set2 = oldFindContiguousSetThatSumsUpTo( numbers, sum );
    end = process.hrtime( start );
    set2.sort();

    console.info( "Execution time assignment 2 (old solution): %ds %dms", end[0], end[1] / 1000000 );
    console.log( "Answer assignment 2 (old solution):", set[ 0 ] + set[ set.length - 1] );
} )( 25 );
