const fs = require('fs');
const readline = require('readline');

const TILES = {
	".": { type: "nothing", tile: "." },
	"#": { type: "tree", tile: "#" },
}

async function getMap() {
  	const fileStream = fs.createReadStream('input.txt');

  	const map = [];

  	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
  	});
  	// Note: we use the crlfDelay option to recognize all instances of CR LF
  	// ('\r\n') in input.txt as a single line break.

  	for await (const line of rl) {
		map.push( Array.from( line ).map( type => TILES[ type ] ) )
	}

	return map;
}

function travel( map, path ) {
	let position = { x: 0, y: 0 };

	const encountersPerStep = {};
	const encountersPerPath = {};

	let currentTile = null;

	loop:
	while ( position.y < map.length ) {
		for ( let i = 0; i < path.length; i++ ) {
			const step = path[ i ];
			
			position.x += step.x;
			position.y += step.y;

			if ( position.y >= map.length ) { break loop; }

			const row = map[ position.y ];
			currentTile = row[ position.x % row.length ];

			if ( typeof encountersPerStep[ currentTile.type ] === "undefined" ) {
				encountersPerStep[ currentTile.type ] = 0;
			}

			encountersPerStep[ currentTile.type ]++;
		}

		if ( typeof encountersPerPath[ currentTile.type ] === "undefined" ) {
			encountersPerPath[ currentTile.type ] = 0;
		}
	
		encountersPerPath[ currentTile.type ]++;
	}

	return {
		encountersPerStep,
		encountersPerPath,
	};
}

( async () => {
	const map = await getMap();

	const encounters1 = travel( map, [ { "x": 1, "y": 1 } ] );
	const encounters2 = travel( map, [ { "x": 3, "y": 1 } ] );
	const encounters3 = travel( map, [ { "x": 5, "y": 1 } ] );
	const encounters4 = travel( map, [ { "x": 7, "y": 1 } ] );
	const encounters5 = travel( map, [ { "x": 1, "y": 2 } ] );

	console.log(
		encounters1.encountersPerPath.tree *
		encounters2.encountersPerPath.tree *
		encounters3.encountersPerPath.tree *
		encounters4.encountersPerPath.tree *
		encounters5.encountersPerPath.tree
	);
} )();
