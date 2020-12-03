const fs = require('fs');
const readline = require('readline');

const json = [];

async function processLineByLine() {
  const fileStream = fs.createReadStream('input.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  const regex = /([0-9]+)-([0-9]+) (\w): (\w+)/
  for await (const line of rl) {
    const match = line.match( regex );
    
    json.push( {
        line: match[ 0 ],
        pos1: parseInt( match[ 1 ], 10 ),
        pos2: parseInt( match[ 2 ], 10 ),
        char: match[ 3 ],
        password: match[ 4 ],
    } );
  }

  fs.writeFileSync( "./input.json", JSON.stringify( json, null, 4 ) );
}

processLineByLine();
