const lineReader = require( "../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "input.txt" ) );

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

const directions = [
    { x: 0, y: 1 }, // NORTH
    { x: 1, y: 0 }, // EAST
    { x: 0, y: -1 }, // SOUTH
    { x: -1, y: 0 }, // WEST
];

( async () => {
    let result = await lineReader.next();

    const ship1 = new Ship( 0, 0, EAST );
    const waypoint = new Waypoint( 10, 1 );
    const ship2 = new Ship( 0, 0 );

    main:
    while ( ! result.done ) {
        const instruction = result.value[ 0 ];
        const value = parseInt( result.value.substring( 1 ), 10 );

        switch ( instruction ) {
            case "F":
                ship1.move( value );
                ship2.moveTo( waypoint, value );
                break;
            case "L":
                ship1.rotate( -value );
                waypoint.rotate( -value );
                break;
            case "R":
                ship1.rotate( value );
                waypoint.rotate( value );
                break;
            case "N":
                ship1.move( value, NORTH );
                waypoint.move( value, NORTH );
                break;
            case "S":
                ship1.move( value, SOUTH );
                waypoint.move( value, SOUTH );
                break;
            case "E":
                ship1.move( value, EAST );
                waypoint.move( value, EAST );
                break;
            case "W":
                ship1.move( value, WEST );
                waypoint.move( value, WEST );
                break;

        }

        result = await lineReader.next();
    }

    console.log( "Assignment 1:", Math.abs( ship1.x ) + Math.abs( ship1.y ) );
    console.log( "Assignment 2:", Math.abs( ship2.x ) + Math.abs( ship2.y ) );
} )();

class Movable {
    constructor( x, y ) {
        this.x = x;
        this.y = y;
    }

    move( distance, direction = this.direction ) {
        this.x += directions[ direction ].x * distance;
        this.y += directions[ direction ].y * distance;
    }
}

class Ship extends Movable {
    constructor( x, y, direction ) {
        super( x, y );
        this.direction = direction;
    }

    moveTo( waypoint, value ) {
        this.x += waypoint.x * value;
        this.y += waypoint.y * value;
    }

    rotate( degrees ) {
        this.direction += degrees / 90;
        if ( this.direction < 0 ) {
            this.direction += directions.length;
        } else if ( this.direction >= directions.length ) {
            this.direction %= directions.length;
        }
    }
}

class Waypoint extends Movable{
    rotate( degrees ) {
        if ( degrees < 0 ) {
            degrees = degrees + 360;
        }
        for ( let i = 0; i < degrees / 90; i++ ) {
            const x = this.x;
            this.x = this.y;
            this.y = - x;
        }
    }
}
