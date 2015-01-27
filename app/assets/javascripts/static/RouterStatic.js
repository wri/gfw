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
      'explore(/)(:section)': 'staticSection',
      'stayinformed(/)(:section)': 'staticSection',
      'getinvolved(/)(:section)': 'staticSection',
      'about(/)(:section)': 'staticSection',
      'howto(/)(:section)': 'staticSection',
      'sources(/)(:section)': 'staticSection',
    },

    initialize: function(mainView) {
      this.presenter = new PresenterStatic(this);
    },

    staticSection: function(_section, params){
      var fragment = this.current().fragment;
      var section = _section;

      var query = this.queryString();

      var page = (params) ? query['page'] : null;
      var accordion = (params) ? query['t'] : null;
      this.presenter.initSection({
        name: fragment,
        section: section,
        page: page,
        t: accordion
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
        params = Router._extractParameters(route, fragment);
        route = matched[1];
      }

      return {
        route : route,
        fragment : fragment.split('/')[0],
        params : params
      };
    },

    queryString: function () {
      // This function is anonymous, is executed immediately and
      // the return value is assigned to QueryString!
      var query_string = {};
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
            // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
          var arr = [ query_string[pair[0]], pair[1] ];
          query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
          query_string[pair[0]].push(pair[1]);
        }
      }
      return query_string;
    }

  });

  return Router;

});
