const readline = require('readline');
const fs = require('fs');

module.exports = async function*() {
    const fileStream = fs.createReadStream('input.txt');
    
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
  
    const regex = /([0-9]+)-([0-9]+) (\w): (\w+)/
    for await (const line of rl) {
        yield line;
    }

    return;
}