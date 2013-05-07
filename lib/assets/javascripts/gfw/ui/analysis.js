gfw.ui.model.AnalysisButton = Backbone.Model.extend({ });

gfw.ui.view.AnalysisButton = Backbone.View.extend({
  className: 'analysis_control',

  events: {
    'click a#analysis_control': '_onClickButton'
  },

  initialize: function() {
    this.model.bind("change:toggleButton",  this._toggleButton, this);

    var template = $("#analysis_control-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });
  },

  // Button
  _toggleButton: function() {
    if (this.model.get("toggleButton")) {
      this.model.set({tip: "Analysis: count forest change"});
      this.model.set({"disabled": false});
    } else {
      this.model.set({tip: "Analysis: remove user defined area to analyse other areas"});
      this.model.set({"disabled": true});
    }

    this.render();
  },

  _enableButton: function() {
    this.model.set("toggleButton", true);
  },

  _disableButton: function() {
    this.model.set("toggleButton", false);
  },

  _isDisabled: function() {
    return this.model.get("disabled");
  },

  _onClickButton: function(e) {
    e.preventDefault();

    if (!this._isDisabled()) {
      analysis._deleteSelectedShape();
      analysis._showHelper();
      analysis._setupDrawingManager();
    }

  },

  render: function() {
    this.$el.html(this.template.render( this.model.toJSON() ));

    this.$button = this.$("#analysis_control");

    this.$button.tipsy({title: 'data-tip', gravity: 'w'});

    if(this._isDisabled()) {
      this.$button.addClass("disabled");
    }

    return this.$el;
  }
});

gfw.ui.model.AnalysisInfo = Backbone.Model.extend({ });

gfw.ui.view.AnalysisInfo = gfw.ui.view.Widget.extend({
  className: 'info_bar',

  events: {
    "click .toggle" : "_toggleOpen",
    'click a.reset' : '_onClickReset'
  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {
    _.bindAll( this, "toggleDraggable", "onStopDragging");

    this.model.bind("change:draggable", this.toggleDraggable);
    this.model.bind("change:show", this._toggle, this);
    this.model.bind("change:closed", this.toggleOpen, this);

    this.model.set("containment", "#map-container .map");

    var template = $("#analysis-info-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });
  },

  _toggle: function() {
    if (this.model.get("show")) this.render().fadeIn(250);
    else this.$el.fadeOut(250);
  },

  _onClickReset: function(e) {
    e.preventDefault();

    analysis._clearAnalysis();

    this.hide();
  },

  _onClickDownload: function() {
    //TODO: SUBSCRIBE DIALOG
  },

  show: function() {
    this.model.set("show", true);
  },

  hide: function() {
    this.model.set("show", false);
  },

  toggleOpen: function() {
    var that = this;

    if (this.model.get("closed")) {
      that.model.set("contentHeight", that.$content.height());

      this.$info_title.html("User defined area analysis");

      that.$content.animate({ opacity: 0, height: that.defaults.minHeight }, that.defaults.speed, function() {
        that.$info_title.fadeIn(250);
        that.$shadow.fadeOut(250);
      });

      that.$el.addClass("closed");
    } else {
      that.$info_title.fadeOut(250, function() {
        that.$content.animate({ opacity: 1, height: that.model.get("contentHeight") }, that.defaults.speed);
        that.$shadow.fadeIn(250);
      });

      that.$el.removeClass("closed");
    }
  },

  render: function() {
    this.$el.html(this.template.render( this.model.toJSON() ));

    this.$content     = this.$el.find(".content");
    this.$info_title  = this.$el.find(".info_title");
    this.$shadow      = this.$el.find(".shadow");

    return this.$el;
  }
});

gfw.ui.model.Analysis = Backbone.Model.extend({ });

gfw.ui.view.Analysis = gfw.core.View.extend({
  className: 'analysis',

  events: {
    'click a.done'    : '_onClickDone',
    'click a.cancel'  : '_onClickCancel',
    'click a.reset'   : '_onClickDone',
  },

  initialize: function() {
    _.bindAll(this, "_onOverlayComplete", "_clearSelection", "_clearAnalysis");

    this.map = this.options.map;
    this.selectedShapes = [];
    this.selectedShape;

    this.model = new gfw.ui.model.Analysis({});

    this.model.bind("change:toggleDoneButton",  this._toggleDoneButton, this);
    this.model.bind("change:toggleHelper",  this._toggleHelper, this);

    var template = $("#analysis-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  _setupDrawingManager: function() {
    var self = this;

    var options = {
      drawingModes: [ google.maps.drawing.OverlayType.POLYGON ],
      drawingControl: false,
      markerOptions: {
        draggable: false,
        icon: new google.maps.MarkerImage(
          '/assets/icons/marker_exclamation.png',
          new google.maps.Size(45, 45), // desired size
          new google.maps.Point(0, 0),  // offset within the scaled sprite
          new google.maps.Point(20, 20) // anchor point is half of the desired size
        )
      },

      drawingControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.MARKER]
      },

      polygonOptions: config.ANALYSIS_OVERLAYS_STYLE,
      panControl: false,
      map: self.map
    };

    // Create the drawing manager
    this.drawingManager = new google.maps.drawing.DrawingManager(options);

    // Start drawing right away
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);

    // Event binding
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this._onOverlayComplete);
  },

  _onOverlayComplete: function(e) {
    this.drawingManager.setDrawingMode(null);
    this.drawingManager.path = e.overlay.getPath().getArray();
    this.drawingManager.setOptions({ drawingControl: false });
    this._enableDoneButton();

    var newShape = e.overlay;
    newShape.type = e.type;

    this._setSelection(newShape);

    polygon = {
      "type": "MultiPolygon",
      "coordinates": [
        [
          $.map(this.drawingManager.path, function(latlong, index) {
            return [[latlong.lng(), latlong.lat()]];
          })
        ]
      ]
    }

    // https://github.com/maxogden/geojson-js-utils
    var area = 0;
    var points = polygon.coordinates[0][0];
    var j = points.length - 1;
    var p1, p2;

    for (var i = 0; i < points.length; j = i++) {
      var p1 = {
        x: points[i][1],
        y: points[i][0]
      };
      var p2 = {
        x: points[j][1],
        y: points[j][0]
      };
      area += p1.x * p2.y;
      area -= p1.y * p2.x;
    }

    area /= 2;

    area = (area*1000000).toFixed(2)

    analysis.info.model.set("ha", area);
  },

  _clearSelection: function() {
    if (this.selectedShapes.length > 0) {
      for(var i in this.selectedShapes) {
        if (selectedShapes[i]) {
          selectedShapes[i].setEditable(false);
        }
      }

      this.selectedShapes = [];
      this.drawingManager.path = null;
    }
  },

  _deleteSelectedShape: function() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedShape = null;
    }
  },

  _setSelection: function(shape) {
    this._clearSelection();
    this.selectedShape = shape;
  },

  _clearAnalysis: function() {

    this._deleteSelectedShape();

    if (this.drawingManager) {
      this.drawingManager.setDrawingMode(null);
      this.drawingManager.setOptions({ drawingControl: false });
      this.drawingManager.path = null;
    }

    this.button._enableButton();
  },

  _onClickCancel: function(e) {
    e.preventDefault();

    this._clearAnalysis();
    this._hideHelper();
  },

  // Done button
  _toggleDoneButton: function() {
    if (this.model.get("toggleDoneButton")) {
      this.$doneButton.removeClass("disabled");
    } else {
      this.$doneButton.addClass("disabled");
    }
  },

  _enableDoneButton: function() {
    this.model.set("toggleDoneButton", true);
  },

  _disableDoneButton: function() {
    this.model.set("toggleDoneButton", false);
  },

  _onClickDone: function(e) {
    e.preventDefault();

    this.button._disableButton();
    this._hideHelper();
    this.info.show();
  },

  // Helper
  _toggleHelper: function() {
    if (this.model.get("toggleHelper")) {
      $(".legend").fadeOut(250);

      if(GFW.app.currentBaseLayer == "semi_monthly") {
        Timeline.hide();
        this.$helper.delay(650).fadeIn(250);
      } else {
        this.$helper.fadeIn(250);
      }
    } else {
      this.$helper.fadeOut(250);

      setTimeout(function() {
        if (GFW.app.currentBaseLayer === "semi_monthly") Timeline.show();

        $(".legend").fadeIn(250);
      }, 300);
    }
  },

  _showHelper: function() {
    this.model.set("toggleHelper", true);
  },

  _hideHelper: function() {
    this.model.set("toggleHelper", false);
  },

  render: function() {
    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$helper = this.$(".analysis.helper_bar");
    this.$doneButton = this.$(".done");

    var analysisModel = new gfw.ui.model.AnalysisInfo({
      show: false,
      subtitle: "Analysis from Nov 06 to Dec 10",
      ha: "",
      alert_count: "15,384",
      alert_title: "Forma alerts",
      closed: false
    });

    var buttonModel = new gfw.ui.model.AnalysisButton({
      tip: "Analysis: count forest change"
    });

    this.info = new gfw.ui.view.AnalysisInfo({
      model: analysisModel
    });

    this.button = new gfw.ui.view.AnalysisButton({
      model: buttonModel
    });

    $("#map").append(this.button.render());

    $("#map").append(this.info.render());

    return this.$el;
  }
});
