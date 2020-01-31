require([
  'backbone',
  'stories/handlebarsHelpers',
  'views/HeaderView',
  'views/FooterView',
  'stories/routers/StoriesRouter'
], function(
  Backbone,
  handlebarsHelpers,
  HeaderView,
  FooterView,
  StoriesRouter) {

  'use strict';

  handlebarsHelpers.register();
  new StoriesRouter();
  Backbone.history.start({pushState: true});

});
