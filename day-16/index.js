const lineReader = require( "../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "input.txt" ) );

const fieldRanges = [];
const nearbyTickets = [];
const validTickets = [];

( async () => {
    let result = await lineReader.next();

    while ( result.value !== "" ) {
        const { groups } = /(?<fieldName>[\w\s]+): (?<r1min>\d+)-(?<r1max>\d+) or (?<r2min>\d+)-(?<r2max>\d+)/.exec( result.value );

        fieldRanges.push( {
            name: groups.fieldName,
            r1min: parseInt( groups.r1min ),
            r1max: parseInt( groups.r1max ),
            r2min: parseInt( groups.r2min ),
            r2max: parseInt( groups.r2max ),
        } );

        result = await lineReader.next();
    }

    result = await lineReader.next(); // "your ticket:"
    result = await lineReader.next(); // Your ticket data

    const yourTicket = result.value.split( "," ).map( number => parseInt( number, 10 ) );

    result = await lineReader.next(); // Empty line
    result = await lineReader.next(); // "nearby tickets:"

    result = await lineReader.next(); // First nearby ticket.
    while ( ! result.done ) {
        nearbyTickets.push( result.value.split( "," ).map( number => parseInt( number, 10 ) ) );
        result = await lineReader.next();
    }

    console.log( "Processed data." );

    let assignment1Answer = 0;

    for (let i = 0; i < nearbyTickets.length; i++) {
        const ticket = nearbyTickets[i];
        let isTicketValid = true;

        for (let j = 0; j < ticket.length; j++) {
            const value = ticket[j];
            
            if ( ! isValid( value ) ) {
                assignment1Answer += value;
                isTicketValid = false;
            }
        }

        if ( isTicketValid ) {
            validTickets.push( ticket );
        }
    }

    console.log( "Answer assignment 1: " + assignment1Answer );

    validTickets.push( yourTicket );
    const potentialFields = Array( yourTicket.length ).fill().map( () => [] );
    // For each column
    for ( let column = 0; column < yourTicket.length; column++ ) {
        // Check for every field range
        field:
        for ( let j = 0; j < fieldRanges.length; j++ ) {
            const fieldRange = fieldRanges[ j ];
            
            // Applies to every value in that column
            for ( let ticket = 0; ticket < validTickets.length; ticket++ ) {
                const value = validTickets[ ticket ][ column ];

                // If not, this field range does not apply to this column, continue with the next field.
                if ( ! ( ( value >= fieldRange.r1min && value <= fieldRange.r1max ) || ( value >= fieldRange.r2min && value <= fieldRange.r2max ) ) ) {
                    continue field;
                }
            }

            // If so, save this field as a potential match for this column.
            potentialFields[ column ].push( fieldRange.name );
        }
    }

    const fields = Array( fieldRanges.length ).fill();

    while( true ) {
        const index = potentialFields.findIndex( ( field ) => {
            return field !== null && field.length === 1;
        } );

        if ( index === -1 ) {
            break;
        }

        const fieldName = potentialFields[ index ][ 0 ];

        fields[ index ] = fieldName;
        potentialFields[ index ] = null;

        for (let i = 0; i < potentialFields.length; i++) {
            if ( potentialFields[ i ] === null ) {
                continue;
            }
            const indexToRemove = potentialFields[ i ].indexOf( fieldName );
            if ( indexToRemove !== -1 ) {
                potentialFields[ i ] = potentialFields[ i ].filter( item => item !== fieldName )
            }
        }
    }

    let assignment2Answer = null;
    for (let i = 0; i < fields.length; i++) {
        const field = fields[ i ];
        if ( ! field.startsWith( "departure" ) ) {
            continue;
        }

        if ( assignment2Answer === null ) {
            assignment2Answer = yourTicket[ i ];
        } else {
            assignment2Answer *= yourTicket[ i ];
        }
    }

    console.log( "Answer assignment 2: " + assignment2Answer );
} )();

const isValid = ( value ) => {
    for (let i = 0; i < fieldRanges.length; i++) {
        const field = fieldRanges[i];
        const valid = ( value >= field.r1min && value <= field.r1max ) || ( value >= field.r2min && value <= field.r2max );

        if ( valid ) {
            return true;
        }
    }
    return false;
}
