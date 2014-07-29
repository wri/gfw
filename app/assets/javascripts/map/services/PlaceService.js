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
define([
  'Class',
  'mps',
  'uri',
  'underscore',
  'moment',
  'services/LayerSpecService'
], function (Class, mps, UriTemplate, _, moment, layerSpecService) {

  'use strict';

  var PlaceService = Class.extend({

    _uriTemplate: '{name}{/zoom}{/lat}{/lng}{/iso}{/maptype}{/baselayers}{/sublayers}{?geom,begin,end,threshold}',

    /**
     * Defaults url params.
     */
    defaults: {
      baselayers: 'umd_tree_loss_gain,forestgain',
      zoom: 3,
      lat: 15,
      lng: 27,
      maptype: 'grayscale',
      iso: 'ALL'
    },

    /**
     * Create new PlaceService with supplied MapLayerService and
     * Backbone.Router.
     *
     * @param  {Backbond.Router} router Instance of Backbone.Router
     * @return {PlaceService}    Instance of PlaceService
     */
    init: function(router) {
      this.router = router;
      this._presenters = [];
      this._subscribe();
      this.layerSpecService = layerSpecService;
      layerSpecService.placeService = this;
      this._presenters.push(layerSpecService); // this makes the test fail
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      // mps.subscribe('Place/go', _.bind(function(place) {
      //   place.route && this.router.navigateTo();
      // }, this));

      mps.subscribe('Place/register', _.bind(function(presenter) {
        this._presenters = _.union(this._presenters, [presenter]);
      }, this));

      mps.subscribe('Place/update', _.bind(function(place) {
        this._handleNewPlace(place.name, place.params, place.go);
      }, this));
    },

    /**
     * Used by the router view to publish a new url place.
     *
     * @param  {object} params
     */
    publishPlace: function(params) {
      mps.publish('Place/update', [{
        go: true,
        name: 'map',
        params: params
      }]);
    },

    /**
     * Handles a new place.
     *
     * If go is true, fires a Place/go event passing in the place parameters
     * which will include layers retrieved from the MapLayerService. Otherwise
     * the URL is silently updated with a new route.
     *
     * @param  {string}  name   The place name
     * @param  {Object}  params The place parameters
     * @param  {boolean} go     True to publish Place/go event, false to update URL
     */
    _handleNewPlace: function(name, urlParams, go) {
      var route = null;
      var place = {};

      place.params = (urlParams) ? this._standardizeParams(urlParams) :
        this._getPresenterParams(this._presenters);

      place.params.name = place.params.name || name;

      if (go) {
        var baselayers = this.layerSpecService.getBaselayerFilters(place.params.baselayers);
        var sublayers = this.layerSpecService.getSublayerFilters(place.params.sublayers);
        var where = _.union(baselayers, sublayers);

        this.layerSpecService.toggle(
          where,
          _.bind(function(layerSpec) {
            place.layerSpec = layerSpec;
            mps.publish('Place/go', [place]);
          }, this)
        );
      }

      route = this._getRoute(this._destandardizeParams(place.params));
      this.router.navigate(route, {silent: true});
    },

    /**
     * Return route URL for supplied route name and route params.
     *
     * @param  {Object} params The route params
     * @return {string} The route URL
     */
    _getRoute: function(urlParams) {
      return decodeURIComponent(new UriTemplate(this._uriTemplate).fillFromObject(urlParams));
    },

    /**
     * Return standardized representation of supplied params object.
     *
     * @param  {Object} params The params to standardize
     * @return {Object} The standardized params.
     */
    _standardizeParams: function(params) {
      var p = _.extendNonNull({}, this.defaults, params);

      p.baselayers = p.baselayers.split(',');
      p.sublayers = p.sublayers ? p.sublayers.split(',') : null;
      p.zoom = _.toNumber(p.zoom);
      p.lat = _.toNumber(p.lat);
      p.lng = _.toNumber(p.lng);
      p.begin = p.begin ? moment(p.begin) : null;
      p.end = p.end ? moment(p.end) : null;
      p.geom = p.geom ? decodeURIComponent(p.geom) : null;
      p.threshold = p.threshold ? _.toNumber(p.threshold) : null;

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
      var p = _.clone(params);

      p.baselayers = p.baselayers.join(',');
      p.sublayers = p.sublayers ? p.sublayers.join(',') : null;
      p.zoom = String(p.zoom);
      p.lat = p.lat.toFixed(2);
      p.lng = p.lng.toFixed(2);
      p.begin = p.begin ? p.begin.format('YYYY-MM-DD') : null;
      p.end = p.end ? p.end.format('YYYY-MM-DD') : null;
      p.geom = p.geom ? encodeURIComponent(p.geom) : null;
      p.threshold = p.threshold ? String(p.threshold) : null;

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

      _.each(presenters, function(presenter) {
        _.extend(p, presenter.getPlaceParams());
      }, this);

      return p;
    }

  });

  return PlaceService;
});
