function GFW() {
  var args = Array.prototype.slice.call(arguments),
  callback = args.pop(),
  modules = (args[0] && typeof args[0] === "string") ? args : args[0],
  config,
  i;

  if (!(this instanceof GFW)) {
    return new GFW(modules, callback);
  }

  if (!modules || modules === '*') {
    modules = [];
    for (i in GFW.modules) {
      if (GFW.modules.hasOwnProperty(i)) {
        modules.push(i);
      }
    }
  }

  for (i = 0; i < modules.length; i += 1) {
    GFW.modules[modules[i]](this);
  }

  callback(this);
  return this;
}

GFW.modules = {};

GFW.modules.app = function(gfw) {

  gfw.app = {};

  gfw.app.Instance = Class.extend({

    init: function(map, options) {
      this.options = _.defaults(options, {
        user       : 'gfw-01',
        layerTable : 'layerinfo'
      });

      this._precision = 2;
      this._layers = [];

      gfw.log.enabled = options ? options.logging: false;

      this._map = map;

      this.queries = {};
      this.queries.hansen = "SELECT * FROM hansen_data WHERE z=CASE WHEN 8 < {Z} THEN 16 ELSE {Z}+8 END";
      this.queries.sad    = "SELECT CASE WHEN {Z}<14 THEN st_buffer(the_geom_webmercator,(16-{Z})^4) ELSE the_geom_webmercator END the_geom_webmercator, stage, cartodb_id FROM gfw2_imazon WHERE year = 2012";
      this.queries.forma  = "SELECT * FROM forma_zoom_polys WHERE z=CASE WHEN 8 < {Z} THEN 16 ELSE {Z}+8 END";

      this.lastHash = null;

      this._cartodb = Backbone.CartoDB({user: this.options.user});
      this.datalayers = new gfw.datalayers.Engine(this._cartodb, options.layerTable, this._map);

      this._loadBaseLayers();
      this._setupZoom();

    },
    run: function() {
      this._setupListeners();
      this.update();
      gfw.log.info('App is now running!');
    },

    open: function() {
      var that = this;

      var
      dh = $(window).height(),
      hh = $("header").height();

      $("#map").animate({ height: dh - hh }, 250, function() {
        google.maps.event.trigger(that._map, "resize");
        that._map.setOptions({ scrollwheel: true });
        $("body").css({overflow:"hidden"});
      });

    },

    close: function(callback) {
      var that = this;

      $("#map").animate({height: 400 }, 250, function() {

        google.maps.event.trigger(that._map, "resize");
        that._map.setOptions({ scrollwheel: false });
        $("body").css({ overflow:"auto" });

        if (callback) {
          callback();
        }

      });

    },

    _setupZoom:function() {
      var overlayID =  document.getElementById("zoom_controls");
      // zoomIn
      var zoomInControlDiv = document.createElement('DIV');
      overlayID.appendChild(zoomInControlDiv);

      var zoomInControl = new this._zoomIn(zoomInControlDiv, map);
      zoomInControlDiv.index = 1;

      // zoomOut
      var zoomOutControlDiv = document.createElement('DIV');
      overlayID.appendChild(zoomOutControlDiv);

      var zoomOutControl = new this._zoomOut(zoomOutControlDiv, map);
      zoomOutControlDiv.index = 2;
    },

    _zoomIn: function(controlDiv, map) {
      controlDiv.setAttribute('class', 'zoom_in');

      google.maps.event.addDomListener(controlDiv, 'mousedown', function() {
        var zoom = map.getZoom() + 1;
        if (zoom < 20) {
          map.setZoom(zoom);
        }
      });
    },

    _zoomOut: function(controlDiv, map) {
      controlDiv.setAttribute('class', 'zoom_out');

      google.maps.event.addDomListener(controlDiv, 'mousedown', function() {
        var zoom = map.getZoom() - 1;

        if (zoom > 2) {
          map.setZoom(zoom);
        }

      });
    },

    _setupListeners: function(){
      var that = this;

      Legend.init();

      // Setup listeners
      google.maps.event.addListener(this._map, 'zoom_changed', function() {
        that._updateHash(that);
        that._updateSAD();
        that._updateFORMA();
        that._updateHansen();
      });

      google.maps.event.addListener(this._map, 'dragend', function() {
        that._updateHash(that);
      });

      google.maps.event.addListenerOnce(this._map, 'tilesloaded', this._mapLoaded);

    },

    _removeLayer: function(name) {
      this._layers = _.without(this._layers, name);
      this._renderLayers();
    },

    _addLayer: function(name) {
      this._layers.push(name);
      this._renderLayers();
    },

    _renderLayers: function() {

      console.log(this._layers);
      if (this._layers.length > 0) {

        var template = "SELECT cartodb_id||':' ||'{{ table_name }}' as cartodb_id, the_geom_webmercator, '{{ table_name }}' AS name FROM {{ table_name }}";

        var queryArray = _.map(this._layers, function(layer) {
          return _.template(template, { table_name: layer });
        });

        var query = queryArray.join(" UNION ALL ");

        if (this.mainLayer) this.mainLayer.setMap(null);
          this.mainLayer = new CartoDBLayer({
            map: map,
            user_name:'wri-01',
            table_name: this._layers[0],
            query: query,
            layer_order: 10,
            opacity: 1,
            interactive:"cartodb_id, name",
            featureMouseClick: function(ev, latlng, data) {
              console.log(ev, latlng, data);
              alert(data.cartodb_id);
            },
            featureMouseOut: function(ev) {
              // console.log(ev);
            },
            featureMouseOver: function(ev, latlng, data) {
              //console.log(data);
            },
            debug:true,
            auto_bound: false
        });

          this.mainLayer.setInteraction(true);

      } else {
        this.mainLayer.setOpacity(0);
        this.mainLayer.setInteraction(false);
      }

    },

    _updateFORMA: function() {
      var query = this.queries.forma.replace(/{Z}/g, this._map.getZoom());
      this.baseFORMA.setQuery(query);
    },
    _updateSAD: function() {
      var query = this.queries.sad.replace(/{Z}/g, this._map.getZoom());
      this.baseSAD.setQuery(query);
    },
    _updateHansen: function() {
      var query = this.queries.hansen.replace(/{Z}/g, this._map.getZoom());
      this.baseHansen.setQuery(query);
    },

    _loadBaseLayers: function() {

      this.baseHansen = new CartoDBLayer({
        map: map,
        user_name:'wri-01',
        table_name: 'hansen_data',
        query: this.queries.hansen.replace(/{Z}/g, this._map.getZoom()),
        layer_order: "bottom",
        opacity:0,
        interactive:false,
        auto_bound: false
      });

      this.baseSAD = new CartoDBLayer({
        map: map,
        user_name:'wri-01',
        table_name: 'gfw2_imazon',
        query: this.queries.sad.replace(/{Z}/g, this._map.getZoom()),
        layer_order: "bottom",
        opacity:0,
        interactive:false,
        auto_bound: false
      });

      this.baseFORMA = new CartoDBLayer({
        map: map,
        user_name:'wri-01',
        table_name: 'forma_zoom_polys',
        query: this.queries.forma.replace(/{Z}/g, this._map.getZoom()),
        layer_order: "bottom",
        interactive:false,
        auto_bound: false
      });

      this.mainLayer = null;
    },

    _mapLoaded: function(){
      config.mapLoaded = true;

      Circle.init();
      Timeline.init();
      Filter.init();

      showMap ? Navigation.showState("map") : Navigation.showState("home");
    },

    _updateHash: function(self) {

      var
      zoom = self._map.getZoom(),
      lat  = self._map.getCenter().lat().toFixed(GFW.app._precision),
      lng  = self._map.getCenter().lng().toFixed(GFW.app._precision);
      hash = "/map/" + zoom + "/" + lat + "/" + lng;

      History.pushState({ state: 3 }, "Map", hash);
    },

    _parseHash: function(hash) {

      var args = hash.split("/");

      if (args.length >= 3) {

        var
        zoom = parseInt(args[2], 10),
        lat  = parseFloat(args[3]),
        lon  = parseFloat(args[4]);

        if (isNaN(zoom) || isNaN(lat) || isNaN(lon)) {
          return false;
        }

        return {
          center: new google.maps.LatLng(lat, lon),
          zoom: zoom
        };
      }

      return false;
    },

    update: function() {
      var hash = location.hash;

      if (hash === this.lastHash) {
        // console.info("(no change)");
        return;
      }

      var
      State  = History.getState(),
      parsed = this._parseHash(State.hash);

      if (parsed) {
        this._map.setZoom(parsed.zoom);
        this._map.setCenter(parsed.center);
      }

    }
  });
};

GFW.modules.maplayer = function(gfw) {
  gfw.maplayer = {};
  gfw.maplayer.Engine = Class.extend(
    {
    init: function(layer, map) {
      this.layer = layer;
      this._map = map;

      var sw = new google.maps.LatLng(this.layer.get('ymin'), this.layer.get('xmin'));
      var ne = new google.maps.LatLng(this.layer.get('ymax'),this.layer.get('xmax'));
      this._bounds = new google.maps.LatLngBounds(sw, ne);

      this._displayed = false;

      this._setupListeners();

      if (this.layer.get('title') != 'FORMA'){
        this.layer.attributes['visible'] = false;
      }

      this._addControl();
      this._handleLayer();
    },

    _setupListeners: function(){
      var that = this;

      //setup zoom listener
      google.maps.event.addListener(this._map, 'zoom_changed', function() {
        that._inZoom(true);
        that._handleLayer();
      });

      google.maps.event.addListener(this._map, 'dragend', function() {
        that._inBounds(true);
        that._handleLayer();
      });

      this._inZoom(true);
      this._inBounds(true);
    },

    _inZoom: function(reset){

      if (this._inZoomVal == null){
        this._inZoomVal = true;
      }

      if (reset){
        if (this.layer.get('zmin')<=this._map.getZoom() && this._map.getZoom()<=this.layer.get('zmax')) {
          this._inZoomVal = true;
        } else {
          this._inZoomVal = false;
        }
      }
      return this._inZoomVal;
    },
    _inBounds: function(reset){

      if (this._inBoundsVal == null) {
        this._inBoundsVal = true;
      }

      if (reset){
        var bounds = this._map.getBounds();
        if (bounds) {
          var ne = bounds.getNorthEast();
          var sw = bounds.getSouthWest();
          if (this._bounds.intersects(bounds)){
            this._inBoundsVal = true;
          } else {
            this._inBoundsVal = false;
          }
        }

      }
      return this._inBoundsVal;
    },
    _inView: function(){
      if (this._inZoom(false) && this._inBounds(false)) {
        return true;
      } else {
        return false;
      }
    },
    _handleLayer: function(){

      if (this.layer.get('visible') && !this._displayed && this._inView()){
        this._displayed = true;
      } else if (this._displayed && !this._inView()){
        this._displayed = false;
      }
    },
    _addControl: function(){
      var that = this;

      var clickEvent = function() {
        that._toggleLayer(GFW.app);
      };

      var zoomEvent = function() {
        //if (that.layer.attributes['visible']) {
          //that._map.fitBounds(that._bounds);
        //}
      };

      Filter.addFilter(this.layer.get('category_name'), this.layer.get('title'), clickEvent, zoomEvent);

    },
    _bindDisplay: function(display) {
      var that = this;
      this._display = display;
      display.setEngine(this);
    },
    _toggleLayer: function(that){

      this.layer.attributes['visible'] = !this.layer.attributes['visible'];

      var
      id         = this.layer.attributes['title'].replace(/ /g, "_").toLowerCase(),
      visible    = this.layer.get('visible'),
      tableName  = this.layer.get('table_name'),
      title      = this.layer.get('title'),
      category   = this.layer.get('category_name'),
      visibility = this.layer.get('visible');


      console.log(id, visible);

      if (id === 'forma' && showMap && visible ) {
        Timeline.show();
      } else if ( (id === 'forma' && showMap && !visible) || (id === 'hansen' && showMap && visible) || (id === 'imazon_sad' && showMap && visible) ) {
        Timeline.hide();
      }

      var // special layers
      forma  = GFW.app.datalayers.LayersObj.get(1),
      hansen = GFW.app.datalayers.LayersObj.get(565);
      sad    = GFW.app.datalayers.LayersObj.get(567);


        if (category != 'Deforestation') {
          //Legend.toggleItem(title, category, visible);
        }

      if (visible) {

        this._displayed = true;
        console.log("Enabling " + id);

        if (id === 'forma') {

          GFW.app.baseFORMA.setOpacity(1);
          GFW.app.baseHansen.setOpacity(0);
          GFW.app.baseSAD.setOpacity(0);

          forma.attributes['visible']  = false;
          hansen.attributes['visible'] = false;
          sad.attributes['visible']    = false;

          return;
        }

        if (id === 'hansen') {
          console.log(id);

          GFW.app.baseHansen.setOpacity(1);
          GFW.app.baseFORMA.setOpacity(0);
          GFW.app.baseSAD.setOpacity(0);

          hansen.attributes['visible'] = true;
          forma.attributes['visible'] = false;
          sad.attributes['visible']   = false;

          return;
        }

        if (id === 'imazon_sad') {

          GFW.app.baseSAD.setOpacity(1);
          GFW.app.baseFORMA.setOpacity(0);
          GFW.app.baseHansen.setOpacity(0);

          sad.attributes['visible']  = true;
          forma.attributes['visible']  = false;
          hansen.attributes['visible'] = false;

          return;
        }

        GFW.app._addLayer(tableName);

      } else {

        if (id != 'forma' && id != "hansen" && id != "imazon_sad") {
          GFW.app._removeLayer(tableName);
        }

      }
    }
  });

  gfw.maplayer.Display = Class.extend(
    {
    /**
     * Constructs a new Display with the given DOM element.
     */
    init: function() {
      gfw.log.info('displayed');
    },

    /**
     * Sets the engine for this display.
     *
     * @param engine a mol.ui.Engine subclass
     */
    setEngine: function(engine) {
      this._engine = engine;
    },
    getTileUrl: function(tile, zoom) {
      var that = this;
      var url = that.tileurl.replace(RegExp('\\{Z}', 'g'), zoom);
      url = url.replace(RegExp('\\{X}', 'g'), tile.x);
      url = url.replace(RegExp('\\{Y}', 'g'), tile.y);
      return url;
    },
    getOptions: function(tileurl, ispng){
      var that = this;
      var options = {
        alt: "MapServer Layer",
        getTileUrl: this.getTileUrl,
        tileurl: tileurl,
        isPng: ispng,
        maxZoom: 17,
        minZoom: 1,
        name: "MapServer Layer",
        tileSize: new google.maps.Size(256, 256)
      };
      return options;
    }
  }
  );
};

GFW.modules.datalayers = function(gfw) {
  gfw.datalayers = {};

  gfw.datalayers.Engine = Class.extend(
    {
    init: function(CartoDB, layerTable, map) {

      this._map         = map;
      this._bycartodbid = {};
      this._bytitle     = {};
      this._dataarray   = [];
      this._cartodb     = CartoDB;

      var LayersColl    = this._cartodb.CartoDBCollection.extend({
        sql: function(){
          return "SELECT cartodb_id AS id, title, table_name, category_name, zmin, zmax, ST_XMAX(the_geom) AS xmax, \
          ST_XMIN(the_geom) AS xmin, ST_YMAX(the_geom) AS ymax, ST_YMIN(the_geom) AS ymin, tileurl, true AS visible \
          FROM " + layerTable + " \
          WHERE display = TRUE ORDER BY displaylayer ASC";
        }
      });

      this.LayersObj = new LayersColl();
      this.LayersObj.fetch();
      this._loadLayers();
    },
    _loadLayers: function(){
      var that = this;

      this.LayersObj.bind('reset', function() {
        that.LayersObj.each(function(p) {
          that._addLayer(p);
        });
      });

    },
    _addLayer: function(p){
      var layer = new gfw.maplayer.Engine(p, this._map);
    }
  });
};

/**
 * Logging module that gfwtes log messages to the console and to the Speed
 * Tracer API. It contains convenience methods for info(), warn(), error(),
 * and todo().
 *
 */
GFW.modules.log = function(gfw) {
  gfw.log = {};

  gfw.log.info = function(msg) {
    gfw.log._gfwte('INFO: ' + msg);
  };

  gfw.log.warn = function(msg) {
    gfw.log._gfwte('WARN: ' + msg);
  };

  gfw.log.error = function(msg) {
    gfw.log._gfwte('ERROR: ' + msg);
  };

  gfw.log.todo = function(msg) {
    gfw.log._gfwte('TODO: '+ msg);
  };

  gfw.log._gfwte = function(msg) {
    var logger = window.console;
    if (gfw.log.enabled) {
      if (logger && logger.markTimeline) {
        logger.markTimeline(msg);
      }
      console.log(msg);
    }
  };
};
