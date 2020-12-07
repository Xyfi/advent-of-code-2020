const BagRepository = require( "../shared/class-repo" );

( async () => {
    const repo = BagRepository.getInstance();
    await repo.init();

    let count = 0;
    repo.getAll().forEach( bag => {
        if ( bag.contains( "shiny gold" ) > 0 ) {
            count++;
        }
    } );

    console.log( count );
} )();