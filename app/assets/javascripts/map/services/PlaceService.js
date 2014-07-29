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

    _uriTemplate: '{name}{/zoom}{/lat}{/lng}{/iso}{/maptype}{/baselayers}{/sublayers}{?geom,date,threshold}',

    /**
     * Defaults url params
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
      this.layerSpecService.placeService = this;
      this._presenters.push(layerSpecService); // this makes the test fail
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        place.route && this.router.navigateTo();
      }, this));

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
    _handleNewPlace: function(name, params, go) {
      var route = null;
      var place = {};

      // Get place object with standarized params.
      place.params = this._standardizeParams(params ||
        this._getPresenterParams(this._presenters));

      place.params.name = place.params.name || name;

      if (go) {
        var baselayers = this._getBaselayerFilters(place.params.baselayers);
        var sublayers = this._getSublayerFilters(place.params.sublayers);
        var where = _.union(baselayers, sublayers);

        // instead passing options, it takes them from the PlaceService
        var options = {};

        if (params.date) {
          var start = moment(place.params.date.split('-')[0], 'X');
          var end = moment(place.params.date.split('-')[1], 'X');
          options.date = [start, end];
        }

        if (params.threshold) {
          options.threshold = params.threshold;
        }

        layerSpecService.toggle(
          where,
          options,
          _.bind(function(layerSpec) {
            place.params.layerSpec = layerSpec;
            mps.publish('Place/go', [place]);
          }, this)
        );
      }

      route = this._getRoute(place);
      this.router.navigate(route, {silent: true});
    },

    /**
     * Return standardized representation of supplied params object.
     *
     * @param  {Object} params The params to standardize
     * @return {Object} The standardized params.
     */
    _standardizeParams: function(params) {
      var p = _.extendNonNull(_.clone(this.defaults), params);
      p.zoom = _.toNumber(p.zoom);
      p.lat = _.toNumber(p.lat);
      p.lng = _.toNumber(p.lng);
      p.maptype = p.maptype;
      p.iso = p.iso;

      if (p.geom) {
        p.geom = decodeURIComponent(p.geom);
      }

      return p;
    },

    /**
     * Return formated URL representation of supplied params object based on
     * a route name.
     *
     * @param {string}  name   The route name
     * @param  {Object} params Params to standardize
     * @return {Object} Params ready for URL
     */
    _destandardizeParams: function(params) {
      var p = params;

      if (params.name === 'map') {
        p.lat = _.toNumber(p.lat).toFixed(2);
        p.lng = _.toNumber(p.lng).toFixed(2);

        if (p.geom) {
          p.geom = encodeURIComponent(p.geom);
        }

        if (p.layerSpec) {
          var date = [];
          _.each(p.layerSpec.getBaselayers(), function(layer) {
            if (layer.currentDate) {
              date.push('{0}-{1}'.format(layer.currentDate[0].format('X'),
                layer.currentDate[1].format('X')));
            }
          });
          if (date.length > 0) {
            p.date = date.join(',');
          } else {
            delete p.date;
          }
        }
      }

      return p;
    },

    /**
     * Return route URL for supplied route name and route params.
     *
     * @param  {string} name The route name (e.g. map)
     * @param  {Object} params The route params
     * @return {string} The route URL
     */
    _getRoute: function(place) {
      var params = _.extend(this._destandardizeParams(_.clone(place.params)));
      return decodeURIComponent(new UriTemplate(this._uriTemplate).fillFromObject(params));
    },

    /**
     * Return param object representing state from all registered presenters
     * that implement getPlaceParams().
     *
     * @param  {Array} presenters The registered presenters
     * @return {Object} Params representing state from all presenters
     */
    _getPresenterParams: function(presenters) {
      var params = {};
      _.each(presenters, _.bind(function(presenter) {
        _.extend(params, presenter.getPlaceParams());
      }, this));

      return params;
    },

    /**
     * Return array of filter objects {slug:, category_slug:} for baselayers.
     *
     * @param  {string} layers CSV list of baselayer slug names
     * @return {Array} Filter objects for baselayers
     */
    _getBaselayerFilters: function(layers) {
      var baselayers = layers ? layers.split(',') : [];
      var filters = _.map(baselayers, function (name) {
        return {slug: name, category_slug: 'forest_clearing'};
      });

      return filters;
    },

    /**
     * Return array of filter objects {id:} for sublayers.
     *
     * @param  {string} layers CSV list of sublayer ids
     * @return {Array} Filter objects for sublayers
     */
    _getSublayerFilters: function(layers) {
      var sublayers = layers ? layers.split(',') : [];
      var filters = _.map(sublayers, function(id) {
        return {id: Number(id)};
      });

      return filters;
    }
  });

  return PlaceService;
});
