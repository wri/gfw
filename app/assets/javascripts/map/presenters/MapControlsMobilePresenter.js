/**
 * The MapControlsMobilePresenter class for the MapControlsMobilePresenter view.
 *º
 * @return MapControlsMobilePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var MapControlsMobilePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: [{
      'AnalysisMobile/open': function() {
        this.view.toogleAnalysisBtn($('#analysis-tab').hasClass('is-analysis'));
      }
    },{
      'AnalysisResults/Delete': function() {
        this.view.toogleAnalysisBtn(false);
      }
    }],

    /**
     * Used by mobile version to open legend and analysis
     *
     */
    openLegend: function() {
      mps.publish('LegendMobile/open');
    },

    openAnalysis: function(){
      mps.publish('AnalysisMobile/open');
    }

  });

  return MapControlsMobilePresenter;
});
