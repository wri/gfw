/**
 * The CartoDB Torque map layer module.
 * @return TorqueLayerClass (extends LayerClass).
 */
define([
  'underscore', 'moment',
  'abstract/layer/OverlayLayerClass',
  'map/presenters/TorqueLayerPresenter',
  'text!map/cartocss/default_torque_style.cartocss',
  'text!map/queries/default_torque.sql.hbs',
], function(_, moment, OverlayLayerClass, Presenter, CARTOCSS, SQL) {

  'use strict';

  var REQUIRED_OPTIONS = ['table', 'column'];

  var validTorqueStep = function(change) {
    return (change.time > 0 && !isNaN(change.time));
  };

  var TorqueLayerClass = OverlayLayerClass.extend({

    defaults: {
      user: 'wri-01',
      cartocss: CARTOCSS,
      cartodb_logo: false,
      countby: 'count(cartodb_id)',
      resolution: 2,
      steps: 256,
      blendmode  : 'lighter',
      animationDuration: 30
    },

    init: function(layer, options, map) {
      _.bindAll(this, '_handleStart', '_handleTimeStep');

      this._validateOptions();
      this.presenter = new Presenter(this);

      this.options = _.extend(this.options, options);
      this._super(layer, options, map);
    },

    _validateOptions: function(options) {
      REQUIRED_OPTIONS.forEach(function(option_name) {
        if (!this.options.hasOwnProperty(option_name)) {
          throw new Error("Missing " + option_name + " option");
        }
      }, this);
    },

    _getSql: function() {
      var sqlTemplate = Handlebars.compile(SQL),
          templateOptions = _.extend(this.options, {
            startDate: moment(this.options.currentDate[0]).toISOString(),
            endDate: moment(this.options.currentDate[1]).toISOString()
          });
      return sqlTemplate(templateOptions);
    },

    _getLayer: function() {
      var deferred = new $.Deferred();

      var torqueOptions = _.extend(this.options, {
        name: this.name, map: this.map, sql: this._getSql()});
      var torqueLayer = this.torqueLayer = new torque.GMapsTorqueLayer(torqueOptions);

      torqueLayer.on('change:time', this._handleStart(deferred));
      torqueLayer.on('change:time', this._handleTimeStep);

      torqueLayer.setMap(this.map);
      torqueLayer.play()

      return deferred.promise();
    },

    _handleTimeStep: function(change) {
      if (validTorqueStep(change)) {
        this.presenter.updateTimelineDate(change);
      }
    },

    _handleStart: function(deferred) {
      var handler = function(change) {
        // Torque currently has no "on ready" event, so wait until it
        // starts spitting out valid step changes
        if (validTorqueStep(change)) {
          this.torqueLayer.off('change:time', handler);

          this.presenter.animationStarted(
            this.torqueLayer.getTimeBounds());

          deferred.resolve(this.torqueLayer);
        }
      }.bind(this);

      return handler;
    },

    setDateRange: function(dates) {
      this.options.currentDate = dates;
      this.torqueLayer.setSQL(this._getSql());
    },

    setDate: function(date) {
      var step = Math.round(this.torqueLayer.timeToStep(date.getTime()))
      this.torqueLayer.setStep(step);
    },

    toggle: function() {
      this.torqueLayer.toggle();
    },

    start: function() {
      this.torqueLayer.play();
    },

    stop: function() {
      this.torqueLayer.pause();
    },

    removeLayer: function() {
      this.torqueLayer.setMap(null);
      this._super();
    }

  });

  return TorqueLayerClass;
});
