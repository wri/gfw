/**
 * The router module.
 *
 * Router handles app routing and URL parameters and updates Presenter.
 *
 * @return singleton instance of Router class (extends Backbone.Router).
 */
define([
  'underscore',
  'backbone',
  'static/PresenterStatic'
], function(_, Backbone,PresenterStatic) {

  'use strict';

  var Router = Backbone.Router.extend({

    // temporary, we will do it with env variables
    _cacheVersion: 5,

    routes: {
      'keepupdated(/)(:section)': 'staticSection'
    },

    initialize: function(mainView) {
      this.presenter = new PresenterStatic(this);
    },

    staticSection: function(_section){
      console.log(this.current());
      var fragment = this.current().fragment;
      var section = _section;
      this.presenter.initSection({
        name: fragment,
        section: section
      });
    },

    navigateTo: function(route, options) {
      this.navigate(route, options);
    },

    current : function() {
      var Router = this,
          fragment = Backbone.history.fragment,
          routes = _.pairs(Router.routes),
          route = null, params = null, matched;

      matched = _.find(routes, function(handler) {
          route = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
          return route.test(fragment);
      });

      if(matched) {
          // NEW: Extracts the params using the internal
          // function _extractParameters 
          params = Router._extractParameters(route, fragment);
          route = matched[1];
      }
      return {
          route : route,
          fragment : fragment.split('/')[0],
          params : params
      };
    }    

  });

  return Router;

});
