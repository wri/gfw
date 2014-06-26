<<<<<<< HEAD
'use strict';

// Application entry point
=======
/**
 * Application entry point.
 */
>>>>>>> 1cb14972add1184afb633dc81e3d4e8bbba6eb1a
require([
  'utils',
  'backbone',
  'underscore'
], function (utils, Backbone, _) {

  require(['router', 'services/AnalysisService', 'mps'],
    function(router, as, mps) {
      if (!Backbone.History.started) {
        Backbone.history.start({pushState: true});
      }
      // For dev
      window.analysis = as;
      window.mps = mps;
      window.router = router;
    });
});
