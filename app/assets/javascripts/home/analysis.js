gfw.ui.model.AnalysisInfoModel = cdb.core.Model.extend({
  hidden: true,
  closed: false,
  date_range: "",
  alert_count: "",
  ha: "",
  dataset: "",
});

gfw.ui.view.AnalysisInfo = cdb.core.View.extend({

});

gfw.ui.model.AnalysisModel = cdb.core.Model.extend({
  disabled: false,
  active: false
});

gfw.ui.view.Analysis = cdb.core.View.extend({

  el: '.analysis',

  events: {
    'click .analysis-link': '_clickAnalysis',
    'click .analysis-bar .done': '_clickDone',
    'click .analysis-bar .cancel': '_clickCancel',
  },

  initialize: function() {
    this.model = new gfw.ui.model.AnalysisModel();

    this.model.bind('change:disabled', this._toggleButton, this);

    this._initViews();

    this.render();
  },

  _initViews: function() {
    this.info = new gfw.ui.view.AnalysisInfo();
  },

  _toggleButton: function() {
    if (this.model.get('disabled')) {
      this.$button.addClass('disabled');
    } else {
      this.$button.removeClass('disabled');
    }
  },

  _clickAnalysis: function(e) {
    e.preventDefault();

    if(!this.model.get('disabled')) {
      this.model.set('disabled', true);

      //hide markers

      this.$bar.fadeIn(250);

      this._setupDrawingManager();
    }
  },

  _clickCancel: function(e) {
    e.preventDefault();

    this.model.set('disabled', false);

    this.$bar.fadeOut(250);
  },

  _clickDone: function(e) {
    e.preventDefault();

  },

  _setupDrawingManager: function() {
    var that = this;

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      polygonOptions: config.OVERLAYSTYLES
    });

    this.drawingManager.setMap(map);

    google.maps.event.addListener(this.drawingManager, 'polygoncomplete', function(feature) {
      that._onOverlayComplete(feature);
    });
  },

  _onOverlayComplete: function(polygon) {
    var the_geom = {
      "type": "MultiPolygon",
      "coordinates": [
        $.map(polygon.latLngs.getArray()[0].getArray(), function(latlong, index) {
          return [[latlong.lng(), latlong.lat()]];
        })
      ]
    };

    var c0 = the_geom.coordinates[0][0];
    the_geom.coordinates[0].push(c0);

    this.model.set('the_geom', JSON.stringify(the_geom));
  },

  render: function() {
    this.$map = $("#map");

    this.$button = this.$(".analysis-link");
    this.$bar = this.$(".analysis-bar");

    $(this.$button).tipsy({ title: 'data-tip', fade: true, gravity: 'w' });

    return this;
  }
});
