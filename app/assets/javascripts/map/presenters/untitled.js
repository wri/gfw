define([
  'underscore',
  'Class',
  'Backbone',
  'mps'
], function(_, Class, Backbone, mps) {

  var StatusModel = Backbone.Model.extend({
    defaults: {
      baselayer: null
      threshold: null,
      begin: null,
      end: null,
      resource: null
    }
  });

  var AnalysisToolPresenter = Class.extend({

    datasets: {
      'umd_tree_loss_gain': 'umd-loss-gain',
      'forma': 'forma-alerts',
      'imazon': 'imazon-alerts',
      'fires': 'nasa-active-fires',
      'modis': 'quicc-alerts'
    },

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._subscribe();
      mps.publish('Place/register', [this])
    }

    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this._updateStatusModel(place.params, place.layerSpec.getBaselayes());
      }, this));
    },

    /**
     * Set the current baselayer and update analysis.
     *
     *
     * @param  {Object} layers [description]
     */
    _handleNewLayer: function() {
      this.view.$widgetBtn.toggleClass('disabled', !!!this);

      this._setBaselayer(layers);
      this._updateAnalysis();
    },

    _createResource: function() {

    },

    /**
     * Publish an analysis from a resource.
     *   eg. {geojson: {Obj}}
     *       {wdpa: {String}}
     *       {iso: {String}}
     *
     * @param  {Object} resource Analyze resource.
     */
    _analize: function(resource) {

      mps.publish('Place/update', [{go: false}]);
      mps.publish('AnalysisService/get', [resource]);
    },

    /**
     * Update an existing analysis.
     *
     * @return {[type]} [description]
     */
    _updateAnalysis: function() {

    },

    /**
     * Update the status model form suplied params.
     *
     * @param  {[type]} params [description]
     */
    _updateStatusModel: function(params, baselayers) {
      var baselayer = null;

      params = _.pick(params,
        'threshold', 'begin', 'end');

      if (baselayers) {
        baselayer = baselayers[_.first(_.intersection(
          _.pluck(baselayers, 'slug'),
          _.keys(this.datasets)))];

      }

      _.extend(params, {baselayer: baselayer});

      this.status.set(params);
    }


  });

  return AnalysisToolPresenter;

});
