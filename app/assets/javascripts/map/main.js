/**
 * Application entry point.
 */
require([
  'utils',
  'backbone'
], function (utils, Backbone) {
  'use strict';

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
