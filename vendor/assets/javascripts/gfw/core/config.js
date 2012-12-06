/**
* Global configuration
*/

(function() {

  Config = Backbone.Model.extend({

    VERSION: 1,

    //error track
    REPORT_ERROR_URL: '/api/v0/error',
    ERROR_TRACK_ENABLED: false

  });

  gfw.config = new Config();

})();
