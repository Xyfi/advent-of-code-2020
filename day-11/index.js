const lineReader = require( "../helpers/lineReaderGenerator" )( require( "path" ).resolve( __dirname, "input.txt" ) );

const run = async () => {
    const map = new SeatingMap();
    await map.init();

    let occupied;
    do {
        occupied = map.countOccupied();
        
        for ( let seat of map ) {
            const occupiedAdjacentSeats = seat.getAdjacent().filter( seat => seat.isOccupied() ).length;
            if ( occupiedAdjacentSeats >= 4 ) {
                seat.setOccupied( false );
            } else if ( occupiedAdjacentSeats === 0 ) {
                seat.setOccupied( true );
            }
        }

        map.commitChanges();
    } while( occupied !== map.countOccupied() );

    console.log( "Assignment 1:", occupied );

    map.reset();

    do {
        occupied = map.countOccupied();

        for ( let seat of map ) {
            const occupiedVisibleSeats = seat.getVisible().filter( seat => seat.isOccupied() ).length;
            if ( occupiedVisibleSeats >= 5 ) {
                seat.setOccupied( false );
            } else if ( occupiedVisibleSeats === 0 ) {
                seat.setOccupied( true );
            }
        }

        map.commitChanges();
    } while( occupied !== map.countOccupied() );

    console.log( "Assignment 2:", occupied );
};

const directions = [
    { columnOffset: -1, rowOffset: -1 }, // Top left
    { columnOffset: 0,  rowOffset: -1 }, // Top
    { columnOffset: 1,  rowOffset: -1 }, // Top right
    { columnOffset: -1, rowOffset: 0 }, // Left
    { columnOffset: 1,  rowOffset: 0 }, // Right
    { columnOffset: -1, rowOffset: 1 }, // Bottom left
    { columnOffset: 0,  rowOffset: 1 }, // Bottom
    { columnOffset: 1,  rowOffset: 1 }, // Bottom right
];

class Seat {
    constructor ( row, column, map, occupied = false ) {
        this.column = column;
        this.row = row;
        this.map = map;
        this.occupied = occupied;
    }

    getAdjacent() {
        if ( this.adjacent ) {
            return this.adjacent;
        }
        this.adjacent = [];
        for ( let i = 0; i < directions.length; i++ ) {
            this.adjacent.push( this.map.get(
                this.row + directions[ i ].rowOffset,
                this.column + directions[ i ].columnOffset 
            ) );
        }
        this.adjacent = this.adjacent.filter( seat => {
            return seat !== SeatingMap.OUT_OF_BOUNDS && seat !== SeatingMap.NO_SEAT;
        } );
        return this.adjacent;
    }

    getVisible() {
        if ( this.visible ) {
            return this.visible;
        }
        this.visible = [];
        for ( let i = 0; i < directions.length; i++ ) {
            this.visible.push( this.getFirstSeatInDirection( directions[ i ] ) );
        }
        this.visible = this.visible.filter( seat => {
            return seat !== SeatingMap.OUT_OF_BOUNDS;
        } );
        return this.visible;
    }

    getFirstSeatInDirection( direction ) {
        const tileLocation = {
            column: this.column + direction.columnOffset,
            row: this.row + direction.rowOffset,
        };

        let tile = this.map.get( tileLocation.row, tileLocation.column );
        while ( tile === SeatingMap.NO_SEAT ) {
            tileLocation.column += direction.columnOffset;
            tileLocation.row    += direction.rowOffset;
            tile = this.map.get( tileLocation.row, tileLocation.column );
        }
        return tile;
    }

    isOccupied() {
        return this.occupied; 
    }

    setOccupied( occupied ) {
        this.prevOccupied = occupied;
    }

    commit() {
        if ( this.occupied !== this.prevOccupied ) {
            if ( this.prevOccupied ) {
                this.map.occupiedCount++;
            } else {
                this.map.occupiedCount--;
            }
        }
        this.occupied = this.prevOccupied;
    }
}

class SeatingMap {
    constructor() {
        this.seats = new Map();
        this.occupiedCount = 0;
    }

    static OUT_OF_BOUNDS = -1;
    static NO_SEAT = 0;

    async init() {
        let result = await lineReader.next();
        this.columns = result.value.length;
        let row = 0;
        while ( ! result.done ) {
            for ( let col = 0; col < this.columns; col++ ) {
                if ( result.value[ col ] === "." ) { continue };
                this.seats.set( `${ row }-${ col }`, new Seat( row, col, this ) );
            }
            row++
            result = await lineReader.next();
        }
        this.rows = row;
    }

    get( row, column ) {
        if ( row < 0 || row >= this.rows || column < 0 || column >= this.columns ) {
            return SeatingMap.OUT_OF_BOUNDS;
        }

        const seat = this.seats.get( `${ row }-${ column }` );
        if ( seat ) {
            return seat;
        }

        return SeatingMap.NO_SEAT;
    }

    commitChanges() {
        this.seats.forEach( seat => seat.commit() );
    }

    countOccupied() {
        return this.occupiedCount;
    }

    draw() {
        console.log( "" );
        for ( let row = 0; row < this.rows; row++ ) {
            let rowDraw = "";
            for ( let column = 0; column < this.columns; column++ ) {
                const seat = this.get( row, column );
                if ( seat ) {
                    if ( seat.isOccupied() ) {
                        rowDraw += "#";
                    } else {
                        rowDraw += "L";
                    }
                } else {
                    rowDraw += ".";
                }
            }
            console.log( rowDraw );
        }
    }

    reset() {
        for ( let seat of this ) {
            seat.setOccupied( false );
            seat.commit();
        }
    }

    *[Symbol.iterator]() {
        for ( const s of this.seats.values() ) {
            yield s;
        }
    }
}

run();
