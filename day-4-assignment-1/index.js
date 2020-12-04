const input = require( "./input.json" );

const requiredFields = [
    "byr",
    "iyr",
    "eyr",
    "hgt",
    "hcl",
    "ecl",
    "pid",
    // "cid",
];

let validPassports = 0;

console.log( input.passports.length );

input.passports.forEach( passport => {
    const passportFields = Object.keys( passport );

    if ( passportFields.length < requiredFields.length ) {
        return;
    }

    let valid = true;
    for (let i = 0; i < requiredFields.length; i++) {
        const currentField = requiredFields[i];
        
        valid = passportFields.includes( currentField ) && valid;
    }

    if ( valid ) {
        validPassports++;
    }
} );

console.log( validPassports );
