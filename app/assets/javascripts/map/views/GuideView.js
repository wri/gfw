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
  'map/helpers/guidetexts',
], function(_, Handlebars, enquire, guide, guideTexts) {

  'use strict';

  var GuideView = Backbone.View.extend({

    el: 'body',

    events: {
    },

    initialize: function() {

      $(window).load(_.delay(_.bind(function() {
        var guide = $("body").guide();

        // Layers module
        guide.addStep("#layers-menu", guideTexts.layersmenu,{
          position: 'bottom'
        });

        // Legend module
        guide.addStep("#module-legend", guideTexts.legend,{
          position: 'right'
        });

        // Controls module
        guide.addStep("#module-map-controls", guideTexts.mapcontrols, {
          position: 'right'
        });

        // Country tab
        guide.addStep("#module-tabs", guideTexts.countrytab, {
          position: 'left',
          callfront: function() {
            $('#countries-tab-button').removeClass('active').click();
            $('#countries-country-select').val(null).trigger('change').trigger("liszt:updated");
          }
        });

        // Analysis tab
        guide.addStep("#module-tabs", guideTexts.analysistab, {
          position: 'left',
          callfront: function() {
            $('#analysis-tab-button').removeClass('active').click();
          }
        });

        // Subscription tab
        guide.addStep("#module-tabs", guideTexts.subscriptiontab, {
          position: 'left',
          callfront: function() {
            $('#get-started-subscription').click();
            $('#subscription-tab-button').removeClass('active').click();
          }
        });

        // Basemap tab
        guide.addStep("#module-tabs", guideTexts.basemaptab, {
          position: 'left',
          callfront: function() {
            $('#basemaps-tab-button').removeClass('active').click();
          }
        });

        // Timeline module
        guide.addStep(".timeline-container", guideTexts.timeline, {
          position: 'top',
          callfront: function() {
            $('#basemaps-tab-button').addClass('active').click();
          }
        });

        // How to module
        guide.addStep(".shape-howto", guideTexts.howto, {
          position: 'bottom'
        });

        guide.start();
      }, this), 1000));
    },

  });

  return GuideView;

});
