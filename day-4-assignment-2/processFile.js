const fs = require( "fs" );
const { exit } = require("process");

let content = fs.readFileSync( "input.txt", "utf8" );

passports = content
    .replace( /\n(?!\n)/gm, " " )
    .split( "\n" )
    .map( line => {
        return line.trim().split( " " ).map( value => {
            return value.split( ":" );
        } );
    } )
    .map( document => {
        return document.reduce( ( acc, value ) => {
            acc[ value[ 0 ] ] = value[ 1 ];
            return acc;
        }, {} )
    } );

fs.writeFileSync( "input.json", JSON.stringify( {
    passports,
}, null, 4 ) );
