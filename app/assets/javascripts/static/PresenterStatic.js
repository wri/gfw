define([
  'underscore',
  'mps',
  'uri',
  'moment',
  'map/presenters/PresenterClass'
], function (_, mps, UriTemplate, moment, PresenterClass) {

  'use strict';

  var urlDefaultsParams = {
    section: 'intro'
  };

  var PlaceService = PresenterClass.extend({

    _uriTemplate: '{name}{/section}{?page}{?t}',

    /**
     * Create new PlaceService with supplied Backbone.Router.
     *
     * @param  {Backbond.Router} router Instance of Backbone.Router
     */
    init: function(router) {
      this.router = router;
      this._super();
    },

    /**
     * Subscribe to application events.
     */
    _subscriptions: [{
      'SourceStatic/update': function(params) {
        this._updateSection(params);
      }
    },{
      'SourceStatic/Silentupdate': function(params) {
        this._updateSectionSilent(params);
      }
    }],

    /**
     * Init by the router to set the name
     * and publish the first section.
     *
     * @param  {String} name   Place name
     * @param  {Object} params Url params
     */
    initSection: function(params) {
      this._name = params.name;
      this._page = params.page;
      this._t = params.t;
      params.interesting = $('.'+params.section).data('interesting');
      this._updateSection(params);
    },

    /**
     * Silently updates the url from the presenter params.
     */
    _updateSection: function(params) {
      params.name = (params.name) ? params.name : this._name;
      params.page = (params.page) ? params.page : this._page;
      params.t = (params.t) ? params.t : null;
      var route = this._getRoute(params);
      this.router.navigateTo(route, {silent: true});
      mps.publish('SourceStatic/change', [params]);
    },

    _updateSectionSilent: function(params){
      params.name = (params.name) ? params.name : this._name;
      params.page = (params.page) ? params.page : this._page;
      var route = this._getRoute(params);
      this.router.navigateTo(route, {silent: true});
    },

    _getRoute: function(param) {
      var url = new UriTemplate(this._uriTemplate).fillFromObject(param);
      return decodeURIComponent(url);
    },

  });

  return PlaceService;
});
