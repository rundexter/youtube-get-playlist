var _       = require('lodash')
  , google  = require('googleapis')
  , util    = require('./util.js')
  , service = google.youtube('v3')
;

var pickInputs = {
        'part'                          : 'part',
        'channelId'                     : 'channelId',
        'id'                            : 'id',
        'mine'                          : 'mine',
        'hl'                            : 'hl',
        'maxResults'                    : 'maxResults',
        'onBehalfOfContentOwner'        : 'onBehalfOfContentOwner',
        'onBehalfOfContentOwnerChannel' : 'onBehalfOfContentOwnerChannel'
    }
  , pickOutputs = {
        'kind'         : 'kind',
        'etag'         : 'etag',
        'totalResults' : 'pageInfo.totalResults',
        'items'        : 'items'
    }
;

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var OAuth2       = google.auth.OAuth2
          , oauth2Client = new OAuth2()
          , access_token = dexter.provider('google').credentials('access_token')
          , self         = this
        ;

        // set credentials
        oauth2Client.setCredentials({ access_token: access_token });

        google.options({ auth: oauth2Client });

        service.playlists.list(util.pickInputs(step, pickInputs), function (error, data) {
          return error
            ? self.fail(error) 
            : self.complete(_.map(data.items, function(i) {
                return { 
                    id                   : i.id
                    , playlist_title     : _.get(i, 'snippet.title')
                    , playlist_thumbnail : _.get(i, 'snippet.thumbnails.default.url')
                    , channel_title      : _.get(i, 'snippet.channelTitle')
                };
            }));
        });
    }
};
