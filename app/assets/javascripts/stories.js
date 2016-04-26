require([
  'backbone',
  'views/HeaderView', 'views/FooterView',
  'stories/routers/StoriesRouter'
], function(
  Backbone,
  HeaderView, FooterView,
  StoriesRouter) {

  'use strict';

  new StoriesRouter();
  Backbone.history.start({pushState: true});

});
