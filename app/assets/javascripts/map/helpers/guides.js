define([
  'mps',
  'map/helpers/guidetexts',
],function(mps, guidetexts) {

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
        selector: "#layersnav-forest-change",
        text: guidetexts.default.layersmenu_1,
        options: {
          position: 'right',
          callfront: function() {
            // WOOOWWWWW mega selectors...
            var $forestChangeDropDown = $('#layersnav-forest-change');
            var $forestChangeLoss = $forestChangeDropDown.find('.layer[data-layer="loss"]');
            var $forestChangeGain = $forestChangeDropDown.find('.layer[data-layer="forestgain"]');

            $forestChangeDropDown.addClass('tour-active');
            if(!$forestChangeLoss.hasClass('selected')) {
              $forestChangeLoss.click();
            }
            if(!$forestChangeGain.hasClass('selected')) {
              $forestChangeGain.click();
            }
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

      // Analysis tab
      {
        selector: "#module-tabs",
        text: guidetexts.default.analysistab,
        options: {
          position: 'left',
          callfront: function() {
            mps.publish('Tab/toggle', ['analysis-tab', true]);
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
          }
        }
      },

      // How to module
      {
        selector: ".m-header-item.shape-howto",
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
            mps.publish('Country/update', [{ country: 'BRA', region: null}]);            
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
            mps.publish('Country/bounds');
            
            // TO-DO: develop a toggle layer mps event
            $('#layersnav-forest-change').addClass('tour-active');
            if(!$('#layersnav-forest-change .layer[data-layer="umd_as_it_happens"]').hasClass('selected')) {
              $('#layersnav-forest-change .layer[data-layer="umd_as_it_happens"]').click();
            }
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
            $('#layersnav-forest-change').removeClass('tour-active');
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
            var geojson = {
              geometry: {
                type: "Polygon",
                coordinates: [[[-55.1953,-0.5273],[-56.4258,-2.9869],[-54.4922,-2.9869],[-55.1953,-0.5273]]]
              }
            };          
            mps.publish('Tab/toggle', ['analysis-tab', true]);
            mps.publish('Subscribe/toggle', [ false ]);
            mps.publish('Analysis/geojson',[geojson.geometry]);
            mps.publish('Analysis/drawGeojson',[geojson, true]);
          }
        }
      },

      // Analysis tab draw
      {
        selector: "#subscription-modal .subscription-modal-window",
        text: guidetexts.glad.analysistab_2,
        options: {
          position: 'left',
          callfront: function() {
            mps.publish('Tab/toggle', ['analysis-tab', true]);
            mps.publish('Subscribe/toggle', [ true ]);
          }
        }
      },

      // Analysis tab draw
      {
        selector: "#module-tabs",
        text: guidetexts.glad.analysistab_3,
        options: {
          position: 'left',
          callfront: function() {
            mps.publish('Tab/toggle', ['analysis-tab', true]);
            mps.publish('Subscribe/toggle', [ false ]);
            mps.publish('Analysis/iso', [{ country: 'BRA', region: null}, false]);
            mps.publish('Country/bounds');
          }
        }
      },

      // Analysis tab draw
      {
        selector: "#module-tabs",
        text: guidetexts.glad.analysistab_4,
        options: {
          position: 'left',
          callfront: function() {
            mps.publish('Tab/toggle', ['analysis-tab', true]);
            mps.publish('Analysis/shape', [{ wdpaid: 352203, use: null, useid: null }]);

            // TO-DO: develop a toggle layer mps event
            if(!$('#layersnav-conservation .layer[data-layer="protected_areasCDB"]').hasClass('selected')) {
              $('#layersnav-conservation .layer[data-layer="protected_areasCDB"]').click();
            }
          }
        }
      },
      // Analysis tab draw
      {
        selector: "#module-tabs",
        text: guidetexts.glad.highresolutiontab,
        options: {
          position: 'left',
          callfront: function() {
            mps.publish('Tab/toggle', ['hd-tab', true]);
          }
        }
      },
    ]
  }

  return guides;

});
