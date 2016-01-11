require([
  'backbone', 'underscore',
  'connect/routers/UserRouter'
], function(Backbone, _, UserRouter) {

  'use strict';

  var router = new UserRouter();
  Backbone.history.start({pushState: true});

  // Force nav links to navigate, rather than doing a browser page
  // reload
  $('#user-profile-nav').on('click', 'a', function(event) {
    event.preventDefault();
    var root = location.protocol + '//' + location.host + '/',
        href = _.last($(this).prop('href').split(root));

    router.navigate(href, {trigger: true});
  });

});
