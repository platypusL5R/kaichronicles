
/**
 * Privacy controller page
 */
class privacyController {

    /**
      * Render the page
      */
    public static index() {
        views.loadView( 'privacy_' + state.language + '.html' )
        .then(function() {
            if( cordovaApp.isRunningApp() )
                $('#privacy-web').hide();
            else
                privacyController.setupWeb();
        });
    }

    /**
     * Setup the web page
     */
    private static setupWeb() {
        
        $('#privacy-app').hide();

        // Setup checkbox
        $('#privacy-send').prop( 'checked' , GoogleAnalytics.isEnabled() );

        // Change send analytics event
        $('#privacy-send').click( function( e : Event ) {
            GoogleAnalytics.setEnabled( $(this).prop( 'checked' ) );
            toastr.info( 'OK' );
        });
    }

}