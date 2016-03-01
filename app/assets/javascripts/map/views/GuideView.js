/**
 * The GuideView view.
 *
 * @return GuideView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'cookie',
  'map/helpers/guide',
  'map/helpers/guidetexts',
  'map/presenters/GuidePresenter',
], function(_, Handlebars, enquire, Cookies, guide, guideTexts, GuidePresenter) {

  'use strict';

  var GuideView = Backbone.View.extend({

    el: 'body',

    events: {
    },

    initialize: function() {
      this.presenter = new GuidePresenter(this);
    },

    setTour: function() {
      this.guide = $("body").guide();

      // Intro
      this.guide.addStep("", guideTexts.intro,{
        position: 'center'
      });

      // Layers module
      this.guide.addStep(".categories-list", guideTexts.layersmenu_1,{
        position: 'bottom',
        callfront: function() {
          $('#layersnav-forest-change').removeClass('tour-active');
        }
      });

      // Layers module
      this.guide.addStep("#layersnav-forest-change", guideTexts.layersmenu_2,{
        position: 'right',
        callfront: function() {
          $('#layersnav-forest-change').addClass('tour-active');
        }
      });

      // Legend module
      this.guide.addStep("#module-legend", guideTexts.legend,{
        position: 'right',
        callfront: function() {
          $('#layersnav-forest-change').removeClass('tour-active');
        }
      });

      // Controls module
      this.guide.addStep("#module-map-controls", guideTexts.mapcontrols, {
        position: 'right',
        align: 'bottom'
      });

      // Country tab
      this.guide.addStep("#module-tabs", guideTexts.countrytab, {
        position: 'left',
        callfront: function() {
          $('#countries-tab-button').removeClass('active').click();
          $('#countries-country-select').val(null).trigger('change').trigger("liszt:updated");
        }
      });

      // Analysis tab
      this.guide.addStep("#module-tabs", guideTexts.analysistab, {
        position: 'left',
        callfront: function() {
          $('#analysis-tab-button').removeClass('active').click();
        }
      });

      // Subscription tab
      // this.guide.addStep("#module-tabs", guideTexts.subscriptiontab, {
      //   position: 'left',
      //   callfront: function() {
      //     $('#get-started-subscription').click();
      //     $('#subscription-tab-button').removeClass('active').click();
      //   }
      // });

      // Basemap tab
      this.guide.addStep("#module-tabs", guideTexts.basemaptab, {
        position: 'left',
        callfront: function() {
          $('#basemaps-tab-button').removeClass('active').click();
        }
      });

      // High resolution tab
      this.guide.addStep("#module-tabs", guideTexts.hrestab, {
        position: 'left',
        callfront: function() {
          $('#hd-tab-button').removeClass('active').click();
        }
      });

      // High resolution tab
      this.guide.addStep("#module-tabs", guideTexts.hrestab, {
        position: 'left',
        callfront: function() {
          $('#hd-tab-button').removeClass('active').click();
        }
      });

      // Timeline module
      this.guide.addStep(".timeline-container", guideTexts.timeline, {
        position: 'top',
        callfront: function() {
          $('#basemaps-tab-button').addClass('active').click();
        }
      });

      // How to module
      this.guide.addStep(".shape-howto", guideTexts.howto, {
        position: 'bottom',
        margin: 2

      });
    },

    initTour: function() {
      if (!!this.presenter.status.get('tour')) {
        this.askForTour();
      } else if(!this.presenter.status.get('tour') && !Cookies.get('tour')) {
        this.askForTour();
      }
    },

    askForTour: function() {
      Cookies.set('tour', true, { expires: 90 });
      this.guide.start();
    },

  });

  return GuideView;

});
