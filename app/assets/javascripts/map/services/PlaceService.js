/* eslint-disable */
/**
 * The PlaceService class manages places in the application.
 *
 * A place is just the current state of the application which can be
 * represented as an Object or a URL. For example, the place associated with:
 *
 *   http://localhost:5000/map/6/2/17/ALL/terrain/loss
 *
 * Can also be represented like this:
 *
 *  zoom - 6
 *  lat - 2
 *  lng - 17
 *  iso - ALL
 *  maptype - terrain
 *  baselayers - loss
 *
 * The PlaceService class handles the following use cases:
 *
 * 1) New route updates views
 *
 *   The Router receives a new URL and all application views need to be updated
 *   with the state encoded in the URL.
 *
 *   Here the router publishes the "Place/update" event passing in the route
 *   name and route parameters. The PlaceService handles the event by
 *   standardizing the route parameters and publishing them in a "Place/go"
 *   event. Any presenters listening to the event receives the updated
 *   application state and can update their views.
 *
 * 2) Updated view updates URL
 *
 *   A View state changes (e.g., a new map zoom) and the URL needs to be
 *   updated, not only with its new state, but from the state of all views in
 *   the application that provide state for URLs.
 *
 *   Here presenters publishe the "Place/register" event passing in a
 *   reference to themselves. The PlaceService subscribes to the
 *   "Place/register" event so that it can keep references to all presenters
 *   that provide state. Then the view publishes the "Place/update" event
 *   passing in a "go" parameter. If "go" is false, the PlaceService will
 *   update the URL. Otherwise it will publish the "Place/go" event which will
 *   notify all subscribed presenters.
 *
 * @return {PlaceService} The PlaceService class
 */
define(
  [
    'underscore',
    'mps',
    'uri',
    'map/presenters/PresenterClass',
    'map/services/LayerSpecService'
  ],
  function(_, mps, UriTemplate, PresenterClass, layerSpecService) {
    'use strict';

    var urlDefaultsParams = {
      baselayers: 'loss,forestgain,forest2000',
      zoom: 3,
      lat: 15,
      lng: 27,
      maptype: 'grayscale',
      iso: 'ALL',
      lang: null
    };

    var PlaceService = PresenterClass.extend({
      _uriTemplate:
        '{name}{/zoom}{/lat}{/lng}{/iso}{/maptype}{/baselayers}{/sublayers}{?tab,fit_to_geom,geojson,geostore,wdpaid,begin,end,threshold,dont_analyze,hresolution,recentImagery,tour,subscribe,use,useid,layer_options,lang}',

      /**
       * Create new PlaceService with supplied Backbone.Router.
       *
       * @param  {Backbond.Router} router Instance of Backbone.Router
       */
      init: function(router) {
        this.router = router;
        this._presenters = [];
        this._name = null;
        this._presenters.push(layerSpecService); // this makes the test fail
        this._super();
      },

      /**
       * Subscribe to application events.
       */
      _subscriptions: [
        {
          'Place/register': function(presenter) {
            this._presenters = _.union(this._presenters, [presenter]);
          }
        },
        {
          'Place/update': function() {
            this._updatePlace();
          }
        }
      ],

      /**
       * Init by the router to set the name
       * and publish the first place.
       *
       * @param  {String} name   Place name
       * @param  {Object} params Url params
       */
      initPlace: function(name, params) {
        this._name = name;
        this._newPlace(params);
      },

      /**
       * Silently updates the url from the presenter params.
       */
      _updatePlace: function() {
        var route, params;
        params = this._destandardizeParams(
          this._getPresenterParams(this._presenters)
        );

        route = this._getRoute(params);
        this.router.navigateTo(route, { silent: true });
      },

      /**
       * Handles a new place.
       *
       * @param  {Object}  params The place parameters
       */
      _newPlace: function(params) {
        var where,
          place = {};

        place.params = this._standardizeParams(params);

        where = _.union(place && place.params.baselayers, place.params.sublayers);

        layerSpecService.toggle(
          where,
          _.bind(function(layerSpec) {
            place.layerSpec = layerSpec;
            mps.publish('Place/go', [place]);
          }, this)
        );
      },

      /**
       * Return route URL for supplied route name and route params.
       *
       * @param  {Object} params The route params
       * @return {string} The route URL
       */
      _getRoute: function(params) {
        var url = new UriTemplate(this._uriTemplate).fillFromObject(params);
        return decodeURIComponent(url);
      },

      /**
       * Return standardized representation of supplied params object.
       *
       * @param  {Object} params The params to standardize
       * @return {Object} The standardized params.
       */
      _standardizeParams: function(params) {
        var p = _.extendNonNull({}, urlDefaultsParams, params);
        p.name = this._name;

        p.baselayers = _.map(p.baselayers.split(','), function(slug) {
          return { slug: slug };
        });

        p.sublayers = p.sublayers
          ? _.map(p.sublayers.split(','), function(id) {
              return { id: _.toNumber(id) };
            })
          : [];

        p.zoom = _.toNumber(p.zoom);
        p.lat = _.toNumber(p.lat);
        p.lng = _.toNumber(p.lng);
        p.iso = _.object(['country', 'region', 'subRegion'], p.iso.split('-'));
        p.begin = p.begin ? p.begin.format('YYYY-MM-DD') : null;
        p.end = p.end ? p.end.format('YYYY-MM-DD') : null;
        p.geostore = p.geostore ? p.geostore : null;
        p.wdpaid = p.wdpaid ? _.toNumber(p.wdpaid) : null;
        p.threshold = p.threshold ? _.toNumber(p.threshold) : null;
        p.dont_analyze = p.dont_analyze ? p.dont_analyze : null;
        p.subscribe_alerts = p.subscribe_alerts === 'subscribe' ? true : null;
        p.referral = p.referral;
        p.hresolution = p.hresolution;
        p.tour = p.tour;

        if (p.layer_options) {
          p.layer_options = p.layer_options.split(',');
        }

        return p;
      },

      /**
       * Return formated URL representation of supplied params object based on
       * a route name.
       *
       * @param  {Object} params Place to standardize
       * @return {Object} Params ready for URL
       */
      _destandardizeParams: function(params) {
        var p = _.extendNonNull({}, urlDefaultsParams, params);
        var baselayers = _.pluck(p.baselayers, 'slug');
        p.name = this._name;
        p.baselayers = baselayers.length > 0 ? baselayers : 'none';
        p.sublayers = p.sublayers ? p.sublayers.join(',') : null;
        p.zoom = String(p.zoom);
        p.lat = p.lat.toFixed(2);
        p.lng = p.lng.toFixed(2);
        p.iso = _.compact(_.values(p.iso)).join('-') || 'ALL';
        p.begin = p.begin ? p.begin.format('YYYY-MM-DD') : null;
        p.end = p.end ? p.end.format('YYYY-MM-DD') : null;
        p.geostore = p.geostore ? p.geostore : null;
        p.wdpaid = p.wdpaid ? String(p.wdpaid) : null;
        p.threshold = p.threshold ? String(p.threshold) : null;
        p.dont_analyze = p.dont_analyze ? p.dont_analyze : null;
        p.hresolution = p.hresolution;
        p.tour = p.tour;

        if (p.layer_options) {
          p.layer_options = p.layer_options.join(',');
        }

        return p;
      },

      /**
       * Return param object representing state from all registered presenters
       * that implement getPlaceParams().
       *
       * @param  {Array} presenters The registered presenters
       * @return {Object} Params representing state from all presenters
       */
      _getPresenterParams: function(presenters) {
        var p = {};

        _.each(
          presenters,
          function(presenter) {
            _.extend(p, presenter.getPlaceParams());
          },
          this
        );

        return p;
      }
    });

    return PlaceService;
  }
);
