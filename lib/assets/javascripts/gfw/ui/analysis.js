gfw.ui.model.AnalysisReset = Backbone.Model.extend({ });

gfw.ui.view.AnalysisReset = Backbone.View.extend({
  className: 'analysis_reset',

  events: {
    'click a.delete' : '_onClickDelete',
    'click a.cancel' : '_onClickCancel'
  },

  initialize: function() {
    this.model = new gfw.ui.model.AnalysisReset({ });

    this.model.bind("change:toggleReset", this._toggleReset, this);

    var template = $("#analysis_reset-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });
  },

  render: function() {
    this.$el.html(this.template.render( this.model.toJSON() ));

    return this.$el;
  },

  _toggleReset: function() {
    if(this.model.get("toggleReset")) {
      this.$el.fadeIn(250);
    } else {
      this.$el.fadeOut(250);
    }
  },

  show: function() {
    this.model.set("toggleReset", true);
  },

  hide: function() {
    this.model.set("toggleReset", false);
  },

  _onClickDelete: function(e) {
    e.preventDefault();

    analysis._clearAnalysis();
    analysis.info.hide();

    this.hide();
  },

  _onClickCancel: function(e) {
    e.preventDefault();

    this.hide();
  }
});

gfw.ui.model.AnalysisButton = Backbone.Model.extend({
  show: false
});

gfw.ui.view.AnalysisButton = Backbone.View.extend({
  className: 'analysis_control',

  events: {
    'click a#analysis_control': '_onClickButton'
  },

  initialize: function() {
    this.model.bind("change:toggleButton",  this._toggleButton, this);
    this.model.bind("change:show", this._toggle, this);

    var template = $("#analysis_control-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });
  },

  // Button
  _toggleButton: function() {
    if (this.model.get("toggleButton")) {
      this.model.set({"disabled": false});
    } else {
      this.model.set({"disabled": true});
    }

    this._toggleDisabled();
  },

  hide: function() {
    this.model.set("show", false);
  },

  show: function() {
    this.model.set("show", true);
  },

  _toggle: function() {
    if (this.model.get("show")) {
      this.$el.find("#analysis_control").fadeIn(250);
    } else {
      this.$el.find("#analysis_control").fadeOut(250);
    }
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
      analysis.startAnalyzing();
    }
  },

  _toggleDisabled: function() {
    if(this._isDisabled()) {
      this.$button.addClass("disabled");
      this.$button.tipsy('disable');
      $('.tipsy').remove();
    } else {
      this.$button.removeClass("disabled");
      this.$button.tipsy('enable');
    }
  },

  render: function() {
    this.$el.html(this.template.render( this.model.toJSON() ));

    this.$button = this.$("#analysis_control");

    this.$button.tipsy({ title: 'data-tip', fade: true, gravity: 'w' });

    return this.$el;
  }
});

gfw.ui.model.AnalysisInfo = Backbone.Model.extend({ });

gfw.ui.view.AnalysisInfo = gfw.ui.view.Widget.extend({
  className: 'analysis_info',

  events: {
    'click .toggle':      '_toggleOpen',
    'click a.reset':      '_onClickReset',
    'click a.subscribe':  '_onClickSubscribe'
  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {
    _.bindAll( this, "toggleDraggable", "onStopDragging", "_onClickSubscribe", "_updateSubtitle", "_toggleOpen", "open", "close");

    this.model.set("dataset", "forma")

    this.model.bind("change:draggable",   this.toggleDraggable);
    this.model.bind("change:show",        this._toggle,    this);
    this.model.bind("change:ha",          this._changeHA,  this);
    this.model.bind("change:title",       this._updateTitle, this);
    this.model.bind("change:alert_count", this._updateAlertCount, this);
    this.model.bind("change:subtitle",    this._updateSubtitle);
    this.model.bind("change:dataset",     this._updateDataset, this);

    this.model.set("containment", "#map-container .map");

    var template = $("#analysis-info-template").html();

    this.subscribe = new gfw.ui.view.AnalysisSubscribe();
    $("body").append(this.subscribe.render());

    this.reset = new gfw.ui.view.AnalysisReset();
    $("body").append(this.reset.render());

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

    // Subscribe to timeline change_date event to update alerts URL:
    subscribe('timeline:change_date', _.bind(function(y0, m0, y1, m1) {
      var start = '';
      var end = '';
      var dataset = ''
      var iso = window.location.href.split('/')[7];

      if(GFW.app.currentBaseLayer == "semi_monthly") {
        dataset = 'forma';
      } else if(GFW.app.currentBaseLayer == "quarterly") {
        dataset = 'modis';
      } else if(GFW.app.currentBaseLayer == "brazilian_amazon") {
        dataset = 'imazon';
      }

      // Convert months to (1-12):
      m0 = ((m0 - 71) % 12) + 1;
      m1 = ((m1 - 71) % 12) + 1;
      // console.log(y0, m0, y1, m1);

      // Create dates, 0 padding months < 10:
      start = y0 + '-' + ((m0 < 10) ? ("0" + m0) : m0) + '-01';
      end = y1 + '-' + ((m1 < 10) ? ("0" + m1) : m1) + '-01';

      this.start = start;

      this.end = end;
      this.iso = iso;

      this.url = 'http://wip.gfw-apis.appspot.com/datasets/'
      this.dataset = dataset;

      this.dates = [y0, m0, y1, m1];

      if((this.dates[1] >= 1 && this.dates[1] <= 12) && (this.dates[3] >= 1 && this.dates[3] <= 12) && !timeline.playing) {
        this.model.set({'subtitle': this.dates[0]+", "+config.MONTHNAMES_SHORT[this.dates[1]-1].charAt(0).toUpperCase() + config.MONTHNAMES_SHORT[this.dates[1]-1].slice(1).toLowerCase()+" to "+this.dates[2]+", "+config.MONTHNAMES_SHORT[this.dates[3]-1].charAt(0).toUpperCase() + config.MONTHNAMES_SHORT[this.dates[3]-1].slice(1).toLowerCase()});
      }
    }, this));

    // Fire off API request for FORMA alert count for current timeline dates:
    subscribe('timeline:onStopDragging', _.bind(function() {
      this._getAlertCount();
    }, this));
  },

  _updateSubtitle: function() {
    if(this.$el.length > 0) {
      $(this.$subtitle).html(this.model.get("subtitle"));
    }
  },

  _updateDataset: function() {
    this.dataset = this.model.get("dataset");
    this.$dataset.html("Total "+this.dataset+" alerts");

    this._getAlertCount();
  },

  // Gets FORMA alert count via API:
  _getAlertCount: function() {
    var that = this;

    if (this.initStats) {
      var polytype = this.model.get("area");

      var range = "&begin="+this.start+"&end="+this.end

      if (this.iso === 'ALL') {
        this.alertsUrl = this.url+this.dataset+"?geom="+encodeURI(polytype)+range;
        this.downloadUrl = this.url+this.dataset+".shp?geom="+encodeURI(polytype)+range;
      } else {
        this.alertsUrl = this.url+this.dataset+"?iso="+this.iso+range;
        this.downloadUrl = this.url+this.dataset+".shp?iso="+this.iso+range;
      }
    }

    // Hook up the FORMA download URL (zipped up Shapefile):
    this.$('a.download').attr('href', this.downloadUrl);

    this.model.set({'alert_count': 'Analyzing... '});
    executeAjax(
      this.alertsUrl,
      {}, 
      {
        success: _.bind(function(data) {
          if(data && data.value) {
            var unit = (this.model.get("dataset") === 'imazon') ? ' meters' : ' alerts';

            this.model.set({'alert_count': analysis._formatNumber((data.value).toFixed(2)) + unit});
          } else {
            this.model.set({'alert_count': 'No alerts'});
          }
        }, this), 
        error: _.bind(function(error) {
          console.log(error);
        }, this)
      });
  },

  // Helper
  _changeHA: function() {
    this.$el.find(".ha .count strong").html(this.model.get("ha"));
  },

  _toggle: function() {
    if (this.model.get("show")) this.render().fadeIn(250);
    else this.$el.fadeOut(250);
  },

  _onClickReset: function(e) {
    var pos = this.$el.find("a.reset").offset();

    this.reset.$el.css({
      top: pos.top,
      left: pos.left
    });

    e.preventDefault();
    this.reset.show();
  },

  _onClickSubscribe: function(e) {
    e.preventDefault();
    e.stopPropagation();

    this.subscribe.show();
  },

  show: function() {
    this.model.set("show", true);
  },

  hide: function() {
    this.model.set("show", false);
  },

  _updateTitle: function() {
    this.$title.html(this.model.get("title"));
    this.$info_title.html(this.model.get("title"));
  },

  _updateAlertCount: function() {
    this.$alert_count.text(this.model.get("alert_count"));
  },

  open: function() {
    var that = this;

    this.model.set("closed", false);

    this.$info_title.fadeOut(250, function() {
      that.$content.animate({ opacity: 1, height: "263px"}, that.defaults.speed);
      that.$shadow.fadeIn(250);
    });

    this.$el.removeClass("closed");

  },

  close: function() {
    var that = this;
    this.model.set("closed", true);

    this.$content.css('overflow', 'hidden');
    this.$content.animate({
      opacity: 0,
      height: '15px',
      padding: 0
    }, this.defaults.speed, function() {
      that.$info_title.fadeIn(250);
      that.$shadow.fadeOut(250);
    });

    this.$el.addClass("closed");
  },

  render: function() {
    this.$el.html(this.template.render( this.model.toJSON() ));

    this.$content     = this.$el.find(".content");
    this.$info_title  = this.$el.find(".info_title");
    this.$title       = this.$el.find(".info .titles .title");
    this.$dataset     = this.$el.find(".alert .title");
    this.$shadow      = this.$el.find(".shadow");
    this.$alert_count = this.$el.find("#alerts-count");
    this.$subtitle    = this.$el.find(".subtitle");

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
    _.bindAll(this, "_onOverlayComplete", "_clearSelection", "_clearAnalysis", "_onClickCancel");

    this.map = this.options.map;

    this.analyzing = false;

    this.selectedShapes = [];
    this.selectedShape;

    this.model = new gfw.ui.model.Analysis({});

    this.model.bind("change:toggleDoneButton",  this._toggleDoneButton, this);
    this.model.bind("change:toggleHelper",      this._toggleHelper, this);

    this.countries = {CHN:"China", MYS:"Malaysia", VEN:"Venezuela", VNM:"Vietnam", MMR:"Myanmar", BRA:"Brazil", PAN:"Panama", PNG:"Papua New Guinea", ACI:"Ashmore and Cartier Is.", AUS:"Australia", MTQ:"Martinique", IND:"India", BGD:"Bangladesh", BRN:"Brunei", GUF:"French Guiana", LAO:"Laos", THA:"Thailand", IDN:"Indonesia", MEX:"Mexico", JPN:"Japan", PHL:"Philippines", KHM:"Cambodia", TWN:"Taiwan", KEN:"Kenya", MDG:"Madagascar", TZA:"Tanzania", UGA:"Uganda", AGO:"Angola", PRY:"Paraguay", COL:"Colombia", ARG:"Argentina", CMR:"Cameroon", CAF:"Central African Republic", BOL:"Bolivia", LKA:"Sri Lanka", ECU:"Ecuador", SLE:"Sierra Leone", CRI:"Costa Rica", GUY:"Guyana", NPL:"Nepal", GIN:"Guinea", PER:"Peru", HTI:"Haiti", HND:"Honduras", LBR:"Liberia", NGA:"Nigeria", CIV:"Ivory Coast", SSD:"South Sudan", SUR:"Suriname", COD:"Democratic Republic Of The Congo", COG:"Republic Of Congo", RWA:"Rwanda", BTN:"Bhutan", BEN:"Benin", SDN:"Sudan", BDI:"Burundi", GTM:"Guatemala", NIC:"Nicaragua", GHA:"Ghana", GAB:"Gabon", TGO:"Togo", SLV:"El Salvador" }

    var template = $("#analysis-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  startAnalyzing: function() {
    this._clearAnalysis();
    this.info.hide();
    this.button._disableButton();
    this._showHelper();
    this._setupDrawingManager();
    this.analyzing = true;

    GFW.app._hideStoriesMarkers();

    if(GFW.app.mongabayLoaded) {
      GFW.app._hideMongabayLayer();
      GFW.app.mongabayHidden = true;
    }
  },

  _loadCountry: function(ISO) {
    if (Timeline && Timeline.hide) Timeline.hide();
    //legend.close();

    this.info.show();
    this.info.model.set("title", this.countries[ISO] || ISO);

    this._clearSelection();
    this._deleteSelectedShape();
    this._loadCountryGeoJSON(ISO);
  },

  _loadProtectedArea: function(id, title) {

    Timeline.hide();
    //legend.close();

    this.info.show();
    this.info.model.set("title", title);

    this._clearSelection();
    this._deleteSelectedShape();
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

    var that = this;

    var style = config.ANALYSIS_OVERLAYS_STYLE;

    style.editable = false;

    var features = new GeoJSON(the_geom, style);

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

    }

    var ha = Math.random() * 1000000000;
    this.info.model.set("ha", this._formatNumber(Math.round(ha)));

    this._fitBounds();

  },

  _fitBounds: function() {
    var bounds = new google.maps.LatLngBounds();
    var features = this.selectedShapes;

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
    var query = "https://wri-01.cartodb.com/api/v2/sql?q=SELECT the_geom FROM gfw2_countries WHERE iso ='" + ISO + "'&format=geojson";

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
    var polygon = {};
    var c0 = []; 
    var area = null;

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

    // Close the polygon:
    c0 = polygon.coordinates[0][0][0];
    polygon.coordinates[0][0].push(c0);

    area = this._calcArea(polygon);

    analysis.info.model.set("area", JSON.stringify(polygon));
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
          this.selectedShapes[i].setEditable(true);
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
    this._updateHash("ALL");
    this._clearSelection();
    this._deleteSelectedShape();

    if (this.drawingManager) {
      this.drawingManager.setDrawingMode(null);
      this.drawingManager.setOptions({ drawingControl: false });
      this.drawingManager.path = null;
    }

    this.button._enableButton();
  },

  _updateHash: function(iso) {
    var
    hash,
    zoom = this.map.getZoom(),
    lat  = this.map.getCenter().lat().toFixed(GFW.app._precision),
    lng  = this.map.getCenter().lng().toFixed(GFW.app._precision);

    config.iso = iso;

    var layers = config.mapOptions.layers;

    if (layers) {
      hash = "map/" + zoom + "/" + lat + "/" + lng + "/" + config.iso + "/" + layers;
    } else {
      hash = "map/" + zoom + "/" + lat + "/" + lng + "/" + config.iso + "/";
    }

    window.router.navigate(hash);

  },

  _onClickCancel: function(e) {
    e.preventDefault();

    analysis.analyzing = false;
    this._clearAnalysis();
    this._deleteSelectedShape();
    this._hideHelper();

    GFW.app._showStoriesMarkers();

    if(GFW.app.mongabayHidden) {
      GFW.app._loadMongabayLayer();
      GFW.app.mongabayHidden = false;
    }
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
    analysis.analyzing = false;
    this._hideHelper();

    if(!this.info.initStats) this.info.initStats = true;

    this.info._getAlertCount();
    this.info.show();

    GFW.app._showStoriesMarkers();

    if(GFW.app.mongabayHidden) {
      GFW.app._loadMongabayLayer();
      GFW.app.mongabayHidden = false;
    }

    if (this.selectedShape) this.selectedShape.setEditable(false);
  },

  // Helper
  _toggleHelper: function() {
    if (this.model.get("toggleHelper")) {
      $(".legend").fadeOut(250);
      $(".searchbox").fadeOut(250);
      $(".layer_selector").fadeOut(250);

      if(GFW.app.currentBaseLayer == "semi_monthly") {
        Timeline.hide();
        this.$helper.delay(500).fadeIn(250);
      } else if(GFW.app.currentBaseLayer == "quarterly") {
        TimelineNotPlayer.hide();
        this.$helper.delay(500).fadeIn(250);
      } else if(GFW.app.currentBaseLayer == "brazilian_amazon") {
        TimelineImazon.hide();
        this.$helper.delay(500).fadeIn(250);
      } else {
        this.$helper.fadeIn(500);
      }
    } else {
      this.$helper.fadeOut(250);
      this._disableDoneButton();

      setTimeout(function() {
        if (GFW.app.currentBaseLayer === "semi_monthly") Timeline.show();
        if (GFW.app.currentBaseLayer === "quarterly") TimelineNotPlayer.show();
        if (GFW.app.currentBaseLayer === "brazilian_amazon") TimelineImazon.show();

        $(".legend").fadeIn(250);
        $(".searchbox").fadeIn(250);
        $(".layer_selector").fadeIn(250);
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
      subtitle: "Getting dates...",
      ha: "",
      alert_count: "Analyzing...",
      closed: false
    });

    var buttonModel = new gfw.ui.model.AnalysisButton({
      tip: "Analyze an area on the map"
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

    _.bindAll( this, "toggle", "_toggleMode", "_updateTitle", "_updateHelp", "_updateButtonTitle", "_updateSubtitle", "_updatePlaceholder", "_updateInputType", "_onKeyUp", "_sendData" );

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

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  show: function() {
    this.$backdrop.fadeIn(250);
    this.$el.fadeIn(250);

    $(document).on("keyup", this._onKeyUp);
  },

  hide: function(e) {
    var that = this;

    this.$el.fadeOut(250, function() {
      that._clearErrors();
      that._setMode("subscribe");
    });

    this.$backdrop.fadeOut(250);

    $(document).off("keyup");
  },

  _onKeyUp: function(e) {

    if (e.which == 27) this._onEscKey(e);

  },

  _onEscKey: function(e) {
    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    this.hide();

  },

  _onKeyPress: function(e) {

    e.preventDefault();
    e.stopPropagation();

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

      var email = this.$el.find("input.field").val();
      if (!validateEmail(email)) {
        this.$el.find(".input-field").addClass("error");
        this.$el.find(".input-field").find(".icon.error").fadeIn(250);
        this.$el.find(".input-field").find(".error_input_label").html("Please enter a valid email");
        this.$el.find(".input-field").find(".error_input_label").fadeIn(250);

        error = true;
      }

      if (!error) {
        that._sendData();
      }

    } else {
      this.hide();
    }

  },

  _sendData: function() {

    var
    that      = this,
    $form     = this.$el.find("form"),
    $the_geom = $form.find('#area_the_geom');

    if (analysis.selectedShapes && analysis.selectedShapes.length > 0) {
      s = analysis.selectedShapes;
      $the_geom.val(JSON.stringify({
        "type": "MultiPolygon",
        "coordinates": [
          $.map(s, function(shape, index) {
            return [
              $.map(shape.getPath().getArray(), function(latlng, index) {
                return [[latlng.lng().toFixed(4), latlng.lat().toFixed(4)]];
              })
            ]
          })
        ]
      }));
    } else {
      s = analysis.selectedShape;
      $the_geom.val(JSON.stringify({
        "type": "MultiPolygon",
        "coordinates": [[
          $.map(s.getPath().getArray(), function(latlng, index) {
            return [[latlng.lng().toFixed(4), latlng.lat().toFixed(4)]];
          })
        ]]
      }));

    }

    var form_data = '{"topic": "updates/forma", "iso": '+$the_geom.val()+', "email": "'+$form.find("#area_email").val()+'"}';

    $.ajax({
        type: 'POST',
        url: $form.attr('action'),
        crossDomain: true,
        data: form_data,
        dataType: 'json',
        success: function(responseData, textStatus, jqXHR) {
          console.log(responseData, textStatus);

          that._setMode("thanks");
          analysis._clearAnalysis();
          analysis.info.hide();
        },
        error: function (responseData, textStatus, errorThrown) {
          alert('POST failed.');
        }
    });


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
    //
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
