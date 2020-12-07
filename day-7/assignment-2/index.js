const BagRepository = require( "../shared/class-repo" );

( async () => {
    const repo = BagRepository.getInstance();
    await repo.init();

    console.log( repo.get( "shiny gold" ).getInnerBagCount() );
} )();