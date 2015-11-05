/**
 * The GuideView view.
 *
 * @return GuideView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'map/helpers/guide',
], function(_, Handlebars, enquire, guide) {

  'use strict';

  var GuideView = Backbone.View.extend({

    el: 'body',

    events: {
    },

    initialize: function() {

      $(window).load(_.delay(_.bind(function() {
        var guide = $("body").guide();
        // Step
        guide.addStep("#module-legend", "This is the legend",{
          position: 'right'
        });
        // **************************************** //
        // **************************************** //
        // Countries tab
        guide.addStep("#module-tabs", "This is the first tab", {
          position: 'left',
          callfront: function() {
            $('#countries-tab-button').removeClass('active').click();
            $('#countries-country-select').val(null).trigger('change').trigger("liszt:updated");
          }
        });
        // Countries tab
        guide.addStep("#module-tabs", "As you see, we can set a country", {
          position: 'left',
          callfront: function() {
            $('#countries-tab-button').removeClass('active').click();
            $('#countries-country-select').val('BRA').trigger('change').trigger("liszt:updated");
          }
        });
        // Countries tab
        guide.addStep("#module-tabs", "We can set a layer", {
          position: 'left',
          callfront: function() {
            $('#countries-tab-button').removeClass('active').click();
            $('#countries-layers li').first().removeClass('selected').click();
          }
        });

        guide.addStep("#module-legend", "The new layer will appear in your legend",{
          position: 'right'
        });

        // **************************************** //
        // **************************************** //
        // Analysis tab
        guide.addStep("#module-tabs", "We can also change a tab and a subtab", {
          position: 'left',
          callfront: function() {
            $('#analysis-tab-button').removeClass('active').click();
            $('#analysis-nav #country-tab-button').removeClass('active').click();
          }
        });
        // Analysis tab
        guide.addStep("#module-tabs", "We can make an analysis (Let's try)", {
          position: 'left',
          callfront: function() {
            $('#analysis-tab-button').removeClass('active').click();
            $('#analysis-nav #country-tab-button').removeClass('active').click();
            $('#analysis-country-button').click();
          }
        });



        // Step
        guide.addStep(".timeline-container", "This is the timeline", {
          position: 'top'
        });
        // Step
        guide.addStep("#module-map-controls", "Those are the map controls", {
          position: 'right'
        });

        guide.start();
      }, this), 1000));
    },

  });

  return GuideView;

});
