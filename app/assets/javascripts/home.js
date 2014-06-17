// Application entry point
require([
  'app',
  'router',
  'presenter',
  'mediator',
  'backbone'
], function (app, router, presenter, mediator, Backbone) {
  console.log('Main entry point...', app);
  if (!Backbone.History.started) {
    console.log('Backbone.history.start');
    Backbone.history.start({pushState: true});
  }
});