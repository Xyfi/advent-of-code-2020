const { fstat } = require("fs");
const input = require( "./input.json" );

function validateYear( min, max, year ) {
    try {
        parseInt( year );
    } catch( e ) {
        return false;
    }

    return year >= min && year <= max;
}

function validateHeight( height ) {
    const match = height.match( /^([0-9]+)(cm|in)$/ );

    if ( ! match ) {
        return false;
    }

    let value;
    try {
        value = parseInt( match[ 1 ], 10 );
    } catch( e ) {
        return false;
    }

    const units = match[ 2 ];
    if ( ! [ "cm", "in" ].includes( units ) ) {
        return false;
    }

    switch ( units ) {
        case "cm":
            return value >= 150 && value <= 193;
        case "in":
            return value >= 59 && value <= 76;
        default:
            return false;
    }
}

function validateColor( color ) {
    return !! color.match( /^#[0-9a-f]{6}$/ );
}

function validateEyeColor( color ) {
    return [ "amb", "blu", "brn", "gry", "grn", "hzl", "oth" ].includes( color );
}

function validatePassportId( id ) {
    return !! id.match( /^[0-9]{9}$/ );
}

const requiredFields = {
    "byr": validateYear.bind( null, 1920, 2002 ),
    "iyr": validateYear.bind( null, 2010, 2020 ),
    "eyr": validateYear.bind( null, 2020, 2030 ),
    "hgt": validateHeight,
    "hcl": validateColor,
    "ecl": validateEyeColor,
    "pid": validatePassportId,
    // "cid",
};

let validPassports = [];

input.passports.forEach( passport => {
    const passportFields = Object.keys( passport );
    const requiredFieldKeys = Object.keys( requiredFields );

    if ( passportFields.length < requiredFields.length ) {
        return;
    }

    let valid = true;
    for (let i = 0; i < requiredFieldKeys.length; i++) {
        const currentFieldKey = requiredFieldKeys[i];
        
        if ( ! passportFields.includes( currentFieldKey ) ) {
            valid = false; break;
        }

        if ( ! requiredFields[ currentFieldKey ]( passport[ currentFieldKey ] ) ) {
            valid = false; break;
        }
    }

    if ( valid ) {
        validPassports.push( passport );
    }
} );

console.log( validPassports.length );
