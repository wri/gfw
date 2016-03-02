define([
  'map/helpers/guidetexts',
],function(guidetexts) {

  var guidetexts = guidetexts;

  var guides = {
    default: [
      // Intro
      {
        selector: "",
        text: guidetexts.default.intro,
        options: {
          position: 'center'
        }
      },

      // Layers module
      {
        selector: ".categories-list",
        text: guidetexts.default.layersmenu_1,
        options: {
          position: 'bottom',
          callfront: function() {
            $('#layersnav-forest-change').removeClass('tour-active');
          }
        }
      },

      // Layers module
      {
        selector: "#layersnav-forest-change",
        text: guidetexts.default.layersmenu_2,
        options: {
          position: 'right',
          callfront: function() {
            $('#layersnav-forest-change').addClass('tour-active');
          }
        }
      },

      // Legend module
      {
        selector: "#module-legend",
        text: guidetexts.default.legend,
        options: {
          position: 'right',
          callfront: function() {
            $('#layersnav-forest-change').removeClass('tour-active');
          }
        }
      },

      // Controls module
      {
        selector: "#module-map-controls",
        text: guidetexts.default.mapcontrols,
        options: {
          position: 'right',
          align: 'bottom'
        }
      },

      // Country tab
      {
        selector: "#module-tabs",
        text: guidetexts.default.countrytab,
        options: {
          position: 'left',
          callfront: function() {
            $('#countries-tab-button').removeClass('active').click();
            $('#countries-country-select').val(null).trigger('change').trigger("liszt:updated");
          }
        }
      },

      // Analysis tab
      {
        selector: "#module-tabs",
        text: guidetexts.default.analysistab,
        options: {
          position: 'left',
          callfront: function() {
            $('#analysis-tab-button').removeClass('active').click();
          }
        }
      },

      // Basemap tab
      {
        selector: "#module-tabs",
        text: guidetexts.default.basemaptab,
        options: {
          position: 'left',
          callfront: function() {
            $('#basemaps-tab-button').removeClass('active').click();
          }
        }
      },

      // High resolution tab
      {
        selector: "#module-tabs",
        text: guidetexts.default.hrestab,
        options: {
          position: 'left',
          callfront: function() {
            $('#hd-tab-button').removeClass('active').click();
          }
        }
      },

      // Timeline module
      {
        selector: ".timeline-container",
        text: guidetexts.default.timeline,
        options: {
          position: 'top',
          callfront: function() {
            $('#basemaps-tab-button').addClass('active').click();
          }
        }
      },

      // How to module
      {
        selector: ".shape-howto",
        text: guidetexts.default.howto,
        options: {
          position: 'bottom',
          margin: 2
        }
      },
    ],

    glad: [
      // Intro
      {
        selector: "", 
        text: guidetexts.glad.intro,
        options: {
          position: 'center',
          callfront: function() {
            $('#layersnav-forest-change').removeClass('tour-active');
          }
        }
      },

      // Layers module
      {
        selector: "#layersnav-forest-change", 
        text: guidetexts.glad.layersmenu_1,
        options: {
          position: 'right',
          callfront: function() {
            // WOOOWWWWW mega selectors...
            $('#layersnav-forest-change').addClass('tour-active');
            if(!$('#layersnav-forest-change .layer[data-layer="umd_as_it_happens"]').hasClass('selected')) {
              $('#layersnav-forest-change .layer[data-layer="umd_as_it_happens"]').click();
            }
          }
        }
      },

      // Legend module
      {
        selector: "#module-legend", 
        text: guidetexts.glad.legend,
        options: {
          position: 'right',
          callfront: function() {
            // WOOOWWWWW mega selectors...
            $('#layersnav-forest-change').removeClass('tour-active');
            if(!$('#module-legend .layer-sublayer[data-sublayer="gfw_landsat_alerts_coverage"] .onoffswitch').hasClass('checked')) {
              $('#module-legend .layer-sublayer[data-sublayer="gfw_landsat_alerts_coverage"]').click();
            }
          }
        }
      },

      // Analysis tab
      {
        selector: "#module-tabs", 
        text: guidetexts.glad.analysistab_1, 
        options: {
          position: 'left',
          callfront: function() {
            $('#analysis-tab-button').removeClass('active').click();
          }
        }
      },

      // Analysis tab draw
      {
        selector: "#module-tabs", 
        text: guidetexts.glad.analysistab_2, 
        options: {
          position: 'left',
          callfront: function() {
            $('#analysis-tab-button').removeClass('active').click();
            $('#draw-tab-button').removeClass('active').click();
          }
        }
      },

      // Login
      {
        selector: "", 
        text: guidetexts.glad.analysistab_3, 
        options: {
          position: 'center'
        }
      },

      // Analysis tab draw
      {
        selector: "#module-tabs", 
        text: guidetexts.glad.analysistab_4, 
        options: {
          position: 'left',
          callfront: function() {
            $('#analysis-tab-button').removeClass('active').click();
            $('#country-tab-button').removeClass('active').click();
          }
        }
      },

      // Analysis tab draw
      {
        selector: "#my-gfw-container", 
        text: guidetexts.glad.log_in, 
        options: {
          position: 'bottom',
          callfront: function() {
            $('#analysis-tab-button').addClass('active').click();
          }
        }
      },

      // Analysis tab draw
      {
        selector: "", 
        text: guidetexts.glad.intro2, 
        options: {
          position: 'center'
        }
      },

      // Analysis tab draw
      {
        selector: "#module-tabs", 
        text: guidetexts.glad.analysistab_5, 
        options: {
          position: 'left',
          callfront: function() {
            $('#analysis-tab-button').removeClass('active').click();
            $('#draw-tab-button').removeClass('active').click();
          }
        }
      },

      // Timeline module
      {
        selector: ".timeline-container", 
        text: guidetexts.glad.timeline, 
        options: {
          position: 'top',
          callfront: function() {
            $('#analysis-tab-button').addClass('active').click();
          }
        }
      },

      // Analysis tab draw
      {
        selector: "#module-tabs", 
        text: guidetexts.glad.analysistab_6, 
        options: {
          position: 'left',
          callfront: function() {
            $('#analysis-tab-button').removeClass('active').click();
            $('#draw-tab-button').removeClass('active').click();
          }
        }
      },

    ]
  }
  
  return guides;

});


