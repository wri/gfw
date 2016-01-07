require([
  'backbone',
  'connect/routers/UserRouter'
], function(Backbone, UserRouter) {

  'use strict';

  new UserRouter();
  Backbone.history.start({pushState: true});

});
