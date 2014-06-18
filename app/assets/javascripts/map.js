// Application entry point
require([
  'app',
  'router',
  'presenter',
  'mediator',
  'backbone',
  'analysis',
  'mps',
  'jasmine'
], function (app, router, presenter, mediator, Backbone, analysis, mps, jasmine) {
  console.log('Main entry point...', app);
  if (!Backbone.History.started) {
    console.log('Backbone.history.start');
    Backbone.history.start({pushState: true});
  }
  // For dev
  window.analysis = analysis;
  window.mps = mps;
  window.jasmine = jasmine;
});