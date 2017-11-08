/// <reference path="../external.ts" />

/**
 * The load game view interface functions
 */
const loadGameView = {
    
    /**
     * Hide the Android files list
     */
    hideFilesList: function() { $('#loadGame-fileslist').hide(); },

    /**
     * Hide the web file uploader
     */
    hideFileUpload: function() { $('#loadGame-file').hide(); },

    /**
     * Remove all rows on the files list (Android)
     */
    clearFilesList: function() { $('#loadGame-fileslist tbody').empty(); },

    /**
     * Add a file to the file games list (Cordova app)
     * @param fileNames File names to load
     */
    addFilesToList: function(fileNames : Array<string>) {
        
        let html = '';
        if( fileNames.length == 0 ) 
            html += '<tr><td><i>' + translations.text( 'noSavedGames' ) + '</i></td></tr>';
        else {
            for( let fileName of fileNames ) {
                html += '<tr id="' + fileName + '"><td>';
                html += '<button class="btn btn-default table-op" title="Delete" data-filename="' + 
                    fileName + '">' + 
                        '<span class="glyphicon glyphicon-remove"></span>' + 
                    '</button>' +
                    '<a class="savegame" href="' + fileName + '">' + 
                        fileName + 
                    '</a>';
                html += '</td></tr>';
            }
        }

        $('#loadGame-fileslist tbody').append( html );
    },

    /**
     * Bind Android files list events
     */
    bindListEvents: function() {

        // Load game events
        $('.savegame').click(function(e : Event) {
            e.preventDefault();
            loadGameController.fileListClicked( $(this).attr( 'href' ) );
        });

        // Delete file events
        $('#loadGame-fileslist tbody button').click(function(e : Event) {
            // IMPORTANT: Do not remove this preventDefault(), otherwise
            // Cordova beleaves we have changed the current page
            e.preventDefault();
            var fileName = $(this).attr('data-filename');
            if( !confirm( translations.text('confirmDeleteSave' , [ fileName ] ) ) )
                return;
            loadGameController.deleteFile( fileName );
        });
    },

    /**
     * Remove a file name from the files list (Android)
     */
    removeFilenameFromList: function( fileName : string ) {
        // It does not work, because fileName can contain points...
        //$('#' + fileName).remove();
        $('tr[id="' + fileName + '"]').remove();
        
        if( $('#loadGame-fileslist tr').length == 0 )
            // Show the "No games found" message
            loadGameView.addFilesToList([]);
    },

    /**
     * Bind web file uploader events
     */
    bindFileUploaderEvents: function() {
        $('#loadGame-file').change(function() {
            if( !this.files || !this.files[0] )
                return;
            loadGameController.fileUploaderChanged( this.files[0] );
        });
    }
};
