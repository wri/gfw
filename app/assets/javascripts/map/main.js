/**
 * Application entry point.
 */
require([
  'utils',
  'backbone'
], function (utils, Backbone) {
  'use strict';

  require(['router', 'services/AnalysisService', 'mps', 'services/CountryService', 'services/DataService', '_string'],
    function(router, as, mps, cs, ds) {
      if (!Backbone.History.started) {
        Backbone.history.start({pushState: true});
      }
      // For dev
      window.analysis = as;
      window.countryService = cs;
      window.mps = mps;
      window.router = router;
      window.ds = ds;
    });
});
