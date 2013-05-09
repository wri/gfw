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
      analysis._clearAnalysis();
      analysis.info.hide();
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
    "click .toggle"    : "_toggleOpen",
    'click a.reset'    : '_onClickReset',
    'click a.subscribe': '_onClickSubscribe',
    'click a.download' : '_onClickDownload'
  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {
    _.bindAll( this, "toggleDraggable", "onStopDragging", "_onClickSubscribe", "_onClickDownload");

    this.model.bind("change:draggable", this.toggleDraggable);
    this.model.bind("change:show",      this._toggle,    this);
    this.model.bind("change:closed",    this.toggleOpen, this);

    this.model.bind("change:title",     this._updateTitle, this);

    this.model.set("containment", "#map-container .map");

    var template = $("#analysis-info-template").html();

    this.subscribe = new gfw.ui.view.AnalysisSubscribe();
    $("body").append(this.subscribe.render());

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

  _onClickSubscribe: function() {
    this.subscribe.show();
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

  _updateTitle: function() {
    this.$info_title.html(this.model.get("title"));
  },

  toggleOpen: function() {
    var that = this;

    if (this.model.get("closed")) {

      this.model.set("contentHeight", this.$content.height());

      this.model.set("title", "User defined area analysis");

      this.$content.animate({ opacity: 0, height: this.defaults.minHeight }, this.defaults.speed, function() {
        that.$info_title.fadeIn(250);
        that.$shadow.fadeOut(250);
      });

      this.$el.addClass("closed");

    } else {

      this.$info_title.fadeOut(250, function() {
        that.$content.animate({ opacity: 1, height: that.model.get("contentHeight") }, that.defaults.speed);
        that.$shadow.fadeIn(250);
      });

      this.$el.removeClass("closed");
    }

  },

  render: function() {
    this.$el.html(this.template.render( this.model.toJSON() ));

    this.$content     = this.$el.find(".content");
    this.$info_title  = this.$el.find(".info .titles .title");
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
    'click a.reset'   : '_onClickDone'
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

  _loadCountry: function(ISO) {
    Timeline.hide();
    legend.close();

    this.info.show();
    this.info.model.set("title", "Test");

    this._clearSelection();
    this._loadCountryGeoJSON(ISO);
  },

  _loadProtectedArea: function(id, title) {

    console.log(id, title);

    Timeline.hide();
    legend.close();

    this.info.show();
    this.info.model.set("title", title);

    this._clearSelection();
    this._loadProtectedAreaGeoJSON(id);
  },

  _loadProtectedAreaGeoJSON: function(id) {

    var that = this;
    var query = "http://www.protectedplanet.net/sites/"+id+"/protected_areas/geom?simplification=0";

    $.ajax({
      url: query,
      dataType: 'jsonp',
      success: function(response) {
        that._loadPolygon(response.the_geom);
      }
    });

  },

  _loadPolygon: function(the_geom) {

    var style = config.ANALYSIS_OVERLAYS_STYLE;

    style.editable = false;

    var features = new GeoJSON(the_geom, style);

    var bounds = new google.maps.LatLngBounds();

    for (var i in features) {
      if (features[i].length > 0) {
        for (var j in features[i]) {
          var feature = features[i][j];
          feature.setMap(this.map);
          this.selectedShapes.push(feature);
        }
      } else {
        var feature = features[i];
        feature.setMap(this.map);
        this.selectedShapes.push(feature);
      }

      var points = feature.latLngs.getArray()[0].getArray();

      // Extend bounds
      for (var z = 0; z < points.length; z++) {
        lat = points[z].lat();
        lng = points[z].lng();
        point = new google.maps.LatLng(lat, lng);
        bounds.extend(point);
      }

    }

    this.map.fitBounds(bounds);

  },

  _loadCountryGeoJSON: function(ISO) {

    var that = this;
    var query = "https://wri-01.cartodb.com/api/v2/sql?q=SELECT the_geom FROM gfw2_countries WHERE iso ='" + ISO + "'&format=geojson";;

    $.ajax({
      url: query,
      dataType: 'jsonp',
      success: function(the_geom) {
        that._loadPolygon(the_geom);
      }
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

  /*
  * Adds thousands separators.
  **/
  _formatNumber:function(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
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
    };

    var area = this._calcArea(polygon);


    analysis.info.model.set("ha", area);
  },

  _calcArea: function(polygon) {
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

    return this._formatNumber((area*1000000).toFixed(2));

  },

  _clearSelection: function() {

    if (this.selectedShapes.length > 0) {

      for (var i in this.selectedShapes) {
        if (this.selectedShapes[i]) {
          this.selectedShapes[i].setEditable(false);
          this.selectedShapes[i].setMap(null);
        }
      }

      this.selectedShapes = [];
      if (this.drawingManager && this.drawingManager.path) this.drawingManager.path = null;
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

    this._clearSelection();
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

    this._done();

  },

  _done: function() {

    this.button._disableButton();
    this._hideHelper();
    this.info.show();
    this.selectedShape.setEditable(false);

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

gfw.ui.model.AnalysisSubscribe = Backbone.Model.extend({

  defaults: {
    title: "Subscribe to alerts",
    subtitle: "You will receive a monthly email summarizing forest change in this area",
    hidden: false,
    placeholder: "Enter your email",
    mode: "subscribe",
    button_title: "SUBSCRIBE",
    input_type: "text"
  }

});

gfw.ui.view.AnalysisSubscribe = gfw.ui.view.Widget.extend({

  className: 'analysis_subscribe',

  events: {

    "keyup input":   "_onKeyPress",
    "click .invite": "_gotoInvite",
    "click .send":   "_send",
    'click a.close'   : 'hide'

  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {

    _.bindAll( this, "toggle", "_toggleMode", "_updateTitle", "_updateHelp", "_updateButtonTitle", "_updateSubtitle", "_updatePlaceholder", "_updateInputType", "_onKeyUp" );

    this.options = _.extend(this.options, this.defaults);

    this.model = new gfw.ui.model.AnalysisSubscribe();

    this.add_related_model(this.model);

    this.model.bind("change:hidden", this.toggle);

    this.model.bind("change:title",         this._updateTitle);
    this.model.bind("change:button_title",  this._updateButtonTitle);
    this.model.bind("change:subtitle",      this._updateSubtitle);
    this.model.bind("change:help",          this._updateHelp);
    this.model.bind("change:placeholder",   this._updatePlaceholder);
    this.model.bind("change:input_type",    this._updateInputType);
    this.model.bind("change:mode",          this._toggleMode);

    this.$backdrop = $(".white_backdrop");

    var template = $("#analysis_subscribe-template").html();

    $(document).on("keyup", this._onKeyUp);

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  show: function() {
    this.$backdrop.fadeIn(250);
    this.$el.fadeIn(250);
  },

  hide: function() {
    var that = this;

    this.$el.fadeOut(250, function() {
      that._clearErrors();
      that._setMode("subscribe");
    });

    this.$backdrop.fadeOut(250);

    //$("body").css("overflow", "auto");
  },

  _onKeyUp: function(e) {

    if (e.which == 27) this._onEscKey();

  },

  _onEscKey: function(e) {

    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    this.trigger("onEscKey");
    this.hide();

  },

  _onKeyPress: function(e) {

    if (e.keyCode == 13) {
      this._send(e);
    } else {
      this._clearErrors();
    }

  },

  _clearErrors: function() {

    this.$el.find(".input-field .icon.error").fadeOut(250);
    this.$el.find(".input-field").removeClass("error");
    this.$el.find(".input-field .error_input_label").fadeOut(250);
    this.$el.find(".input-field .error_input_label").html("");

  },

  _send: function(e) {
    var that = this;

    e.preventDefault();
    e.stopPropagation();

    var mode = this.model.get("mode");
    var error = false;

    if (mode == "subscribe") {

      this._clearErrors();

      if (!validateEmail(this.$el.find("input").val())) {
        this.$el.find(".input-field").addClass("error");
        this.$el.find(".input-field").find(".icon.error").fadeIn(250);
        this.$el.find(".input-field").find(".error_input_label").html("Please enter a valid email");
        this.$el.find(".input-field").find(".error_input_label").fadeIn(250);

        error = true;
      }

      if (!error) {
        // TODO: send info

        that._setMode("thanks");
        //$.ajax({ type: "post", url: "/register", data: { email: this.$el.find("input").val() }, success: function() {
          //that._setMode("thanks");
        //}});
      }

    } else {
      this.hide();
    }

  },

  _gotoInvite: function(e) {
    e.preventDefault();
    e.stopPropagation();

    this._setMode("request");
  },

  _setMode: function(mode) {

    this._clearErrors();

    if (mode == "subscribe") {

      this.model.set({ title: this.model.defaults.title, help: this.model.defaults.subtitle, button_title: this.model.defaults.button_title, placeholder: this.model.defaults.placeholder, input_type: "email", mode: mode })
      this.$el.find("input").val("");
      this.$el.find("input").focus();
    } else if (mode == "thanks") {
      this.model.set({ title: "Thank you", help: "You're now subscribed to this area", button_title: "Close", mode: mode })
      this.$("input").val("");
    }

  },

  _toggleMode: function() {

    var mode = this.model.get("mode");

    if (mode == "subscribe") {
      this.$(".subtitle").fadeOut(250);;
      this.$(".help").fadeIn(250);
      this.$(".input-field").show();
    } else if (mode == "thanks") {
      this.$(".subtitle").fadeOut(250);;
      this.$(".help").fadeIn(250);
      this.$(".input-field").hide();
    }

  },

  _updatePlaceholder: function() {
    this.$el.find(".holder").html(this.model.get("placeholder"));
  },

  _updateInputType: function() {
    this.$el.find(".field").prop("type", this.model.get("input_type"));
  },

  _updateHelp: function() {
    this.$el.find(".help").html(this.model.get("help"));
  },

  _updateSubtitle: function() {
    this.$el.find(".subtitle").html(this.model.get("subtitle"));
  },

  _updateButtonTitle: function() {
    this.$el.find(".send span").html(this.model.get("button_title"));
  },

  _updateTitle: function() {
    this.$el.find(".title").html(this.model.get("title"));
  },

  render: function() {
    var that = this;

    //$("body").css("overflow", "hidden");

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$el.find(".input-field").smartPlaceholder();


    return this.$el;
  }

});
