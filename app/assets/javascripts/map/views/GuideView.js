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
      // this.presenter = new GuidePresenter(this);
    },

    setDefaultTour: function() {
      this.guide = $("body").guide();

      // Intro
      this.guide.addStep("", guideTexts.default.intro,{
        position: 'center'
      });

      // Layers module
      this.guide.addStep(".categories-list", guideTexts.default.layersmenu_1,{
        position: 'bottom',
        callfront: function() {
          $('#layersnav-forest-change').removeClass('tour-active');
        }
      });

      // Layers module
      this.guide.addStep("#layersnav-forest-change", guideTexts.default.layersmenu_2,{
        position: 'right',
        callfront: function() {
          $('#layersnav-forest-change').addClass('tour-active');
        }
      });

      // Legend module
      this.guide.addStep("#module-legend", guideTexts.default.legend,{
        position: 'right',
        callfront: function() {
          $('#layersnav-forest-change').removeClass('tour-active');
        }
      });

      // Controls module
      this.guide.addStep("#module-map-controls", guideTexts.default.mapcontrols, {
        position: 'right',
        align: 'bottom'
      });

      // Country tab
      this.guide.addStep("#module-tabs", guideTexts.default.countrytab, {
        position: 'left',
        callfront: function() {
          $('#countries-tab-button').removeClass('active').click();
          $('#countries-country-select').val(null).trigger('change').trigger("liszt:updated");
        }
      });

      // Analysis tab
      this.guide.addStep("#module-tabs", guideTexts.default.analysistab, {
        position: 'left',
        callfront: function() {
          $('#analysis-tab-button').removeClass('active').click();
        }
      });

      // Basemap tab
      this.guide.addStep("#module-tabs", guideTexts.default.basemaptab, {
        position: 'left',
        callfront: function() {
          $('#basemaps-tab-button').removeClass('active').click();
        }
      });

      // High resolution tab
      this.guide.addStep("#module-tabs", guideTexts.default.hrestab, {
        position: 'left',
        callfront: function() {
          $('#hd-tab-button').removeClass('active').click();
        }
      });

      // Timeline module
      this.guide.addStep(".timeline-container", guideTexts.default.timeline, {
        position: 'top',
        callfront: function() {
          $('#basemaps-tab-button').addClass('active').click();
        }
      });

      // How to module
      this.guide.addStep(".shape-howto", guideTexts.default.howto, {
        position: 'bottom',
        margin: 2
      });
    },

    setGladTour: function() {
      this.guideGlad = $("body").guide();

      // Intro
      this.guideGlad.addStep("", guideTexts.glad.intro,{
        position: 'center',
        callfront: function() {
          $('#layersnav-forest-change').removeClass('tour-active');
        }        
      });

      // Layers module
      this.guideGlad.addStep("#layersnav-forest-change", guideTexts.glad.layersmenu_1,{
        position: 'right',
        callfront: function() {
          // WOOOWWWWW mega selectors...
          $('#layersnav-forest-change').addClass('tour-active');
          if(!$('#layersnav-forest-change .layer[data-layer="umd_as_it_happens"]').hasClass('selected')) {
            $('#layersnav-forest-change .layer[data-layer="umd_as_it_happens"]').click();
          }
        }
      });

      // Legend module
      this.guideGlad.addStep("#module-legend", guideTexts.glad.legend,{
        position: 'right',
        callfront: function() {
          // WOOOWWWWW mega selectors...
          $('#layersnav-forest-change').removeClass('tour-active');
          if(!$('#module-legend .layer-sublayer[data-sublayer="gfw_landsat_alerts_coverage"] .onoffswitch').hasClass('checked')) {
            $('#module-legend .layer-sublayer[data-sublayer="gfw_landsat_alerts_coverage"]').click();
          }
        }
      });

      // Analysis tab
      this.guideGlad.addStep("#module-tabs", guideTexts.glad.analysistab_1, {
        position: 'left',
        callfront: function() {
          $('#analysis-tab-button').removeClass('active').click();
        }
      });

      // Analysis tab draw
      this.guideGlad.addStep("#module-tabs", guideTexts.glad.analysistab_2, {
        position: 'left',
        callfront: function() {
          $('#analysis-tab-button').removeClass('active').click();
          $('#draw-tab-button').removeClass('active').click();
        }
      });

      // Analysis tab draw
      this.guideGlad.addStep("#module-tabs", guideTexts.glad.analysistab_4, {
        position: 'left',
        callfront: function() {
          $('#analysis-tab-button').removeClass('active').click();
          $('#country-tab-button').removeClass('active').click();
        }
      });

      // Analysis tab draw
      this.guideGlad.addStep("#my-gfw-container", guideTexts.glad.log_in, {
        position: 'bottom',
        callfront: function() {
          $('#analysis-tab-button').addClass('active').click();

        }
      });

      // Analysis tab draw
      this.guideGlad.addStep("", guideTexts.glad.intro2, {
        position: 'center'
      });

      // Analysis tab draw
      this.guideGlad.addStep("#module-tabs", guideTexts.glad.analysistab_5, {
        position: 'left',
        callfront: function() {
          $('#analysis-tab-button').removeClass('active').click();
          $('#draw-tab-button').removeClass('active').click();
        }
      });

      // Timeline module
      this.guideGlad.addStep(".timeline-container", guideTexts.glad.timeline, {
        position: 'top',
        callfront: function() {
          $('#analysis-tab-button').addClass('active').click();
        }
      });

      // Analysis tab draw
      this.guideGlad.addStep("#module-tabs", guideTexts.glad.analysistab_6, {
        position: 'left',
        callfront: function() {
          $('#analysis-tab-button').removeClass('active').click();
          $('#draw-tab-button').removeClass('active').click();
        }
      });

    },

    initTour: function() {
      if (!!this.presenter.status.get('tour')) {
        switch(this.presenter.status.get('tour')) {
          case 'glad':
            this.gladTour();
          break;
          default: 
            this.defaultTour();
          break;
        }
      } else if(!this.presenter.status.get('tour') && !Cookies.get('tour')) {
        this.defaultTour();
      }
    },

    defaultTour: function() {
      Cookies.set('tour', true, { expires: 90 });
      this.guide.start();
    },

    gladTour: function() {
      this.guideGlad.start();
    }

  });

  return GuideView;

});
