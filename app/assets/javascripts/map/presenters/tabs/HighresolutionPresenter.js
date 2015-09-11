/**
 * The HighresolutionPresenter class for the Highresolution view.
 *
 * @return HighresolutionPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
], function(_, mps, PresenterClass) {

  'use strict';

  var HighresolutionPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    initExperiment: function(id) {
      mps.publish('Experiment/choose',[id]);
    },

    setMaptype: function(maptype) {
      mps.publish('Maptype/change', [maptype]);
    }
  });

  return HighresolutionPresenter;
});
