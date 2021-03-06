/// <reference path="../external.ts" />

/**
 * The game controller
 */
const gameController = {

    /**
     * The current book section
     */
    currentSection: <Section> null,

    /**
     * Setup the game view
     */
    index: function() {

        if( !setupController.checkBook() )
            return;

        if( state.sectionStates.currentSection == Book.KAIMONASTERY_SECTION ) {
            gameController.gameTemplateSetup();
            // Special case: Move to the inexistent section for the Kai monastery
            routing.redirect( 'kaimonastery' );
            return;
        }

        views.loadView('game.html')
        .then(function() {
            gameController.gameTemplateSetup();
            gameView.setup();
            // Go to the current section (or the initial)
            var sec = state.sectionStates.currentSection;
            if( !sec )
                sec = Book.INITIAL_SECTION;
            gameController.loadSection(sec, false, state.actionChart.yScrollPosition);
        });

    },

    /** Setup the HTML main page template for the game view */
    gameTemplateSetup : function() {
        template.showStatistics(true);
        template.setNavTitle( state.book.getBookTitle() , '#game' , false);
    },

    /**
     * Load and display a section
     * @param sectionId The section id to display
     * @param choiceLinkClicked True if the section is load due to a choice link click
     * @param yScroll y coord. where to scroll initially
     */
    loadSection: function(sectionId : string, choiceLinkClicked : boolean = false, yScroll : number = 0) {

        // Load and display the section
        var newSection = new Section(state.book, sectionId, state.mechanics);
        if( !newSection.exists() ) {
            console.log("Section " + sectionId + " does not exists" );
            return;
        }
        gameController.currentSection = newSection;

        // Clear previous section toasts:
        toastr.clear();
        
        // Fire choice events:
        if( choiceLinkClicked )
            mechanicsEngine.fireChoiceSelected(sectionId);
        
        // Store the current section id (must to be done BEFORE execute mechanicsEngine.run,
        // there are references to this there)
        state.sectionStates.currentSection = sectionId;

        // Show the section
        gameView.setSectionContent( gameController.currentSection );

        // Update previous / next navigation links
        gameView.updateNavigation( gameController.currentSection );

        // Run section mechanics
        mechanicsEngine.run( gameController.currentSection );
        
        // Bind choice links
        gameView.bindChoiceLinks();

        // Scroll to top (or to the indicated place)
        if( !yScroll )
            yScroll = 0;
        window.scrollTo(0, yScroll);

        // Persist state
        state.persistState();

        if( window.getUrlParameter('debug') ) {
            // Show section that can come to here
            gameView.showOriginSections();

            // Validate this section
            const validator = new BookValidator( state.mechanics , state.book );
            validator.validateSection( gameController.currentSection.sectionId );
            for( let error of validator.errors )
                mechanicsEngine.debugWarning(error);
        }
        
    },

    /**
     * Navigate to the previous or next section
     * @param increment -1 to go the previous. +1 to the next
     */
    onNavigatePrevNext: function(increment : number) {
        var s = gameController.currentSection;
        var newId = ( increment < 0 ? s.getPreviousSectionId() : s.getNextSectionId() );
        gameController.loadSection( newId );
    },

    /** Return page */
    getBackController: function() { 
        return 'mainMenu'; 
    },

    /**
     * On leave controller
     */
    onLeave: function() {
        
        if( !state || !state.actionChart )
            return;

        // Store the scroll position.
        // Special case: Do not store if we are going redirected from 'game' controller, at the index function to 'kaimonastery'
        if( !( routing.getControllerName() == 'kaimonasteryController' && window.pageYOffset == 0 ) )
            state.actionChart.yScrollPosition = window.pageYOffset;

        state.persistState();
    }

};
