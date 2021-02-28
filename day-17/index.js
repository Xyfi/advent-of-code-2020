const input = require( "fs" ).readFileSync( require( "path" ).resolve( __dirname, "./input.txt" ) ).toString( "utf-8" );

function run( dimensions ) {
    const grid = new InfiniteGrid( dimensions );

    const startingGrid = input.split( "\n" ).map( row => row.trim() );

    for ( let row = 0; row < startingGrid.length; row++ ) {
        for ( let column = 0; column < startingGrid[ row ].length; column++ ) {
            grid.add( [ column, row ], startingGrid[ row ].charAt( column ) === "#" );
        }
    }

    for( let i = 0; i < 6; i++ ) {
        step( grid );
    }

    return grid.activeCubes.size;
}

function step( grid ) {
    const willToggle = [];
    grid.activeCubes.forEach( cube => {
        if ( ! [ 2, 3 ].includes( cube.activeNeighbours ) ) {
            willToggle.push( cube );
        }
        grid.createNeighbours( cube );
    } );

    grid.cubes.forEach( cube => {
        if ( cube.active ) {
            return;
        }
        if ( cube.activeNeighbours === 3 ) {
            willToggle.push( cube );
        }
    } );

    willToggle.forEach( cube => {
        grid.toggle( cube );
    } );
}

class InfiniteGrid {
    constructor( nDimensions ) {
        this.nDimensions = nDimensions;
        this.directions = this.getDirections();
        this.cubes = new Map();
        this.activeCubes = new Map();
    }
    add( location, active = false ) {
        while( location.length !== this.nDimensions ) {
            location.push( 0 );
        }
        const cube = this._create( location, active );
        this.getNeighbours( cube ).forEach( neighbour => {
            if ( cube.active ) {
                neighbour.activeNeighbours++;
            }
            if ( neighbour.active ) {
                cube.activeNeighbours++;
            }
        } );
        if ( active ) {
            this.activeCubes.set( cube.id, cube );
        }
        return cube;
    }

    _create ( location, active ) {
        const cube = { id: this.getId( location ), location, active, activeNeighbours: 0 };
        this.cubes.set( cube.id, cube );
        return cube;
    }

    toggle( cube ) {
        if ( cube.active ) {
            this.getNeighbours( cube ).forEach( neighbour => {
                neighbour.activeNeighbours--;
            } );
            this.activeCubes.delete( cube.id );
            cube.active = false;
        } else {
            this.getNeighbours( cube, true ).forEach( neighbour => {
                neighbour.activeNeighbours++;
            } );
            this.activeCubes.set( cube.id, cube );
            cube.active = true;
        }
    }
    getNeighbours( cube ) {
        if ( ! cube.neighbourLocations ) {
            cube.neighbourLocations = this.directions
                .map( dir => dir.map( ( axis, index ) => { return axis + cube.location[ index ] } ) );
        }

        const neighbours = [];
        
        cube.neighbourLocations.forEach( location => {
            const neighbourId = this.getId( location );
            let neighbour = this.cubes.get( neighbourId );
            if ( neighbour ) {
                neighbours.push( neighbour );
            }
        } );

        return neighbours;
    }

    createNeighbours( cube ) {
        cube.neighbourLocations.forEach( location => {
            const neighbourId = this.getId( location );
            let neighbour = this.cubes.get( neighbourId );
            if ( neighbour ) {
                return;
            }
            this.add( location, false );
        } );
    }

    getId( location ) {
        return location.join( "|" );
    }
    getDirections() {
        const directions = [];
        const dir = [];

        ( function r( currentDimension ) {
            if ( currentDimension === 0 ) {
                if ( ! dir.every( a => a === 0 ) ) {
                    directions.push( [ ...dir ] );
                }
                return;
            }
            [ -1, 0, 1 ].map( a => {
                dir[ currentDimension - 1 ] = a;
                r( currentDimension - 1 );
            } );
        } )( this.nDimensions );

        return directions;
    }
}

console.log( `Answer assignment 1: ${ run( 3 ) }` );
console.log( `Answer assignment 2: ${ run( 4 ) }` );
