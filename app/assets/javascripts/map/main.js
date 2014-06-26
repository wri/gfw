'use strict';

// Application entry point
require([
  'utils',
  'backbone'
], function (utils, Backbone) {
  console.log('Main entry point...');

  require(['router', 'services/AnalysisService', 'mps'],
    function(router, as, mps) {
      if (!Backbone.History.started) {
        console.log('Backbone.history.start');
        Backbone.history.start({pushState: true});
      }
      // For dev
      window.analysis = as;
      window.mps = mps;
      window.router = router;
    });
});
