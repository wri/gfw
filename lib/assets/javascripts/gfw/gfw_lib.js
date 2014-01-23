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
      this.options = _.defaults(options);
      this.cloudfront_url = "dyynnn89u7nkm.cloudfront.net";
      this.global_version = 1;
      this._map = map;

      gfw.log.enabled = options ? options.logging: false;

      this.infowindow = new CartoDBInfowindow(this._map);
      // this.protectedInfowindow = new ProtectedInfowindow(this._map);

      this.queries = {};
      this.storiesMarkers = [];
      this.storiesFeatures = [];
      this.storiesLoaded = false;
      this.mongabayMarkers = [];
      this.mongabayFeatures = [];
      this.mongabayLoaded = false;
      this.mongabayHidden = false;
      this.mc = {};

      // we can stop loading the blank (see limit=0 below) tileset here now that we are loading the animation. see todo on line 347
      this.queries.forma    = "SELECT cartodb_id,alerts,z,the_geom_webmercator FROM gfw2_forma WHERE z=CASE WHEN 8 < {Z} THEN 17 ELSE {Z}+8 END limit 0";
      this.queries.annual   = "SELECT cartodb_id,alerts,z,the_geom_webmercator FROM gfw2_hansen WHERE z=CASE WHEN 9 < {Z} THEN 17 ELSE {Z}+8 END";
      this.queries.modis    = "SELECT cartodb_id,the_geom_webmercator FROM modis_forest_change_copy";
      this.queries.imazon   = "SELECT cartodb_id,type,the_geom_webmercator FROM imazon_clean";
      this.queries.fires    = "SELECT cartodb_id,the_geom_webmercator FROM global_7d";

      this.cartodb = Backbone.CartoDB({ user: this.options.user });
      this.datalayers = new gfw.datalayers.Engine(this.cartodb, options.layerTable, this._map);

      // Layers
      this.mainLayer        = null;
      this.protectedLayer   = null;
      this.pantropicalLayer = null;
      this.forest2000Layer  = null;
      this.forestGainLayer  = null;
      this.currentBaseLayer = "forma";
    },

    run: function() {
      this._initListeners();

      gfw.log.info('App is now running!');
    },

    open: function() {
      var that = this;

      var dh = $(window).height(),
          hh = $("header").height();

      $("#map").animate({ height: dh - hh }, 250, function() {
        google.maps.event.trigger(that._map, "resize");

        that._map.setOptions({ scrollwheel: true });
      });
    },

    close: function(callback) {
      var that = this;

      $("#map").animate({ height: 400 }, 250, function() {
        google.maps.event.trigger(that._map, "resize");

        that._map.setOptions({ scrollwheel: false });

        callback && callback();
      });
    },

    _initListeners: function(){
      var that = this;

      google.maps.event.addListener(this._map, 'click', function(e) {
        that.infowindow.close();
        // that.protectedInfowindow.close();

        if (!that.protectedLayer) { return; }

        var lat = e.latLng.lat(),
            lng = e.latLng.lng(),
            params = {lat:lat, lon:lng},
            url = 'http://wip.gfw-apis.appspot.com/wdpa/sites';

        executeAjax(url, params, {
          success: function(sites) {
            var site = null;

            if (sites && sites.length > 0) {
              site = sites[0];
              that.protectedInfowindow.setContent(site);
              that.protectedInfowindow.setPosition(e.latLng);
              that.protectedInfowindow.open();
            }
          },
          error: function(e) {
            console.error('WDPA API call failed', e, url);
          }
        });
      });

      google.maps.event.addListener(map, 'zoom_changed', function() {
        that._refreshBaseLayer();
      });

      google.maps.event.addListener(this._map, 'tilesloaded', this._mapLoaded);
    },

    _removeLayer: function(layer) {
      if (!layer.get('external')) {
        this._layers = _.without(this._layers, layer.get("table_name"));

        this._renderLayers();
      } else {
        if(layer.get('slug') === 'forest2000') {
          this._removeForest2000Layer();
        } else if(layer.get('slug') === 'forestgain') {
          this._removeForestGainLayer();
        } else if(layer.get('slug') === 'pantropical') {
          this._removePantropicalLayer();
        } else {
          this._removeProtectedLayer();
        }
      }

      this._refreshTimeLine();
    },

    _addLayer: function(layer) {
      if (layer.get("external")) {
        var table_name = layer.get("table_name");

        if (table_name === "protected_areas") { this._renderProtectedLayer(layer); }
        if (table_name === "pantropical") { this._renderPantropicalLayer(layer); }
        if (table_name === "forest2000") { this._renderForest2000Layer(layer); }
        if (table_name === "forestgain") { this._renderForestGainLayer(layer); }
      } else {
        this._layers.push(layer.get('table_name'));
        this._renderLayers();
      }

      this._refreshTimeLine();
    },

    _refreshTimeLine: function() {
      var that = this;

      setTimeout(function() {
        Timeline.refresh();
      }, 800);

      this._toggleTimeLayer();
    },

    _removeProtectedLayer: function(layer) {
      if (this.protectedLayer) {
        this.protectedLayer.setOpacity(0);
        this.protectedLayer = null;
      }
    },

    _removePantropicalLayer: function(layer) {
      if (this.pantropicalLayer) {
        this.pantropicalLayer.setOpacity(0);
        this.pantropicalLayer = null;
      }
    },

    _removeForest2000Layer: function(layer) {
      if (this.forest2000Layer) {
        this.forest2000Layer.setOpacity(0);
        this.forest2000Layer = null;
      }
    },

    _removeForestGainLayer: function(layer) {
      if (this.forestGainLayer) {
        this.forestGainLayer.setOpacity(0);
        this.forestGainLayer = null;
      }
    },

    _renderProtectedLayer: function(layer) {
      var that = this;

      var query = layer.get('tileurl');

      if (this.protectedLayer) {
        this.protectedLayer.setOpacity(1);
      } else {

        this.protectedLayer = new google.maps.ImageMapType({
          getTileUrl: function(tile, zoom) {
            return "http://184.73.201.235/blue/" + zoom + "/" + tile.x + "/" + tile.y;
          },
          tileSize: new google.maps.Size(256, 256),
          opacity:0.60,
          isPng: true
        });

        map.overlayMapTypes.push(this.protectedLayer);
      }
    },

    _renderPantropicalLayer: function(layer) {
      var that = this;

      var query = layer.get('tileurl');

      if (this.pantropicalLayer) {
        this.pantropicalLayer.setOpacity(1);
      } else {

        this.pantropicalLayer = new google.maps.ImageMapType({
          getTileUrl: function(tile, zoom) {
            return "http://gfw-ee-tiles.appspot.com/gfw/masked_forest_carbon/" + zoom + "/" + tile.x + "/" + tile.y + ".png";
          },
          tileSize: new google.maps.Size(256, 256),
          opacity:1,
          isPng: true
        });

        map.overlayMapTypes.push(this.pantropicalLayer);
      }
    },

    _renderForest2000Layer: function(layer) {
      var that = this;

      var query = layer.get('tileurl');

      if (this.forest2000Layer) {
        this.forest2000Layer.setOpacity(1);
      } else {
        this.forest2000Layer = new google.maps.ImageMapType({
          getTileUrl: function(tile, zoom) {
            return "http://earthengine.google.org/static/hansen_2013/tree_alpha/" + zoom + "/" + tile.x + "/" + tile.y + ".png";
          },
          tileSize: new google.maps.Size(256, 256),
          opacity:1,
          isPng: true
        });

        map.overlayMapTypes.push(this.forest2000Layer);
      }
    },

    _renderForestGainLayer: function(layer) {
      var that = this;

      var query = layer.get('tileurl');

      if (this.forestGainLayer) {
        this.forestGainLayer.setOpacity(1);
      } else {
        this.forestGainLayer = new google.maps.ImageMapType({
          getTileUrl: function(tile, zoom) {
            return "http://earthengine.google.org/static/hansen_2013/gain_alpha/" + zoom + "/" + tile.x + "/" + tile.y + ".png";
          },
          tileSize: new google.maps.Size(256, 256),
          opacity:1,
          isPng: true
        });

        map.overlayMapTypes.push(this.forestGainLayer);
      }
    },

    _renderLayers: function() {
      debugger;
      if (this._layers.length > 0) {
        var template = "SELECT cartodb_id||':' ||'{{ table_name }}' as cartodb_id, the_geom_webmercator, '{{ table_name }}' AS name FROM {{ table_name }}";

        var queryArray = _.map(this._layers, function(layer) {
          return _.template(template, { table_name: layer });
        });

        queryArray.push("(SELECT cartodb_id||':' ||'caf_lc_1' as cartodb_id, the_geom_webmercator, 'caf_lc_1' AS name FROM caf_lc_1 LIMIT 0)") //a hack for the stupid layer show hide discoloration thing I found

        var query = queryArray.join(" UNION ALL ");

        this.mainLayer && this.mainLayer.setMap(null);

        this.mainLayer = new CartoDBLayer({
          map: map,
          user_name:'',
          tiler_domain:this._cloudfront_url,
          sql_domain:this._cloudfront_url,
          extra_params:{v:this._global_version}, //define a verison number on requests
          tiler_path:'/tiles/',
          tiler_suffix:'.png',
          tiler_grid: '.grid.json',
          table_name: "gfw2_layerstyles_v4",
          query: query,
          layer_order: "top",
          opacity: 1,
          interactivity:"cartodb_id",
          featureClick: this._onMainLayerClick,
          featureOver: function(ev, latlng, pos, data) { map.setOptions({draggableCursor: 'pointer'}); },
          featureOut: function() { map.setOptions({draggableCursor: 'default'}); },
          debug:false,
          auto_bound: false
        });

        this.mainLayer.setInteraction(true);

      } else {
        this.mainLayer.setOpacity(0);
        this.mainLayer.setInteraction(false);
      }
    },

    _refreshBaseLayer: function() {
      if (GFW.app.baseLayer && GFW.app.currentBaseLayer !== "forma") {
        try {
          var query = GFW.app.queries[GFW.app.currentBaseLayer].replace(/{Z}/g, GFW.app._map.getZoom());
          GFW.app.baseLayer.setQuery(query);
        }
        catch(err) { }
      }
    },

    _updateBaseLayer: function() {
      this._toggleTimeLayer();

      GFW.app.baseLayer && GFW.app.baseLayer.setMap(null);

      this._loadBaseLayer();
    },

    _hideBiomeLayer: function(layer) {
      var biomeLayer = GFW.app.datalayers.LayersObj.get(585);

      var visible = biomeLayer.attributes['visible'];
      var disabled = biomeLayer.attributes['disabled'];

      biomeLayer.attributes['disabled'] = true;

      if(visible) {
        biomeLayer.attributes['visible'] = !biomeLayer.attributes['visible'];
        GFW.app._removeLayer(biomeLayer);
        Filter.toggleBiome(585);
      }

      Filter.disableBiome();
    },

    _toggleTimeLayer: function() {
      if (this.timelayer && GFW.app.currentBaseLayer !== "forma") {
        this.timelayer.hide();
        // Timeline.hide();
      }

      if(this.timelayer_modis && GFW.app.currentBaseLayer !== "modis") {
        this.timelayer_modis.hide();
        TimelineModis.hide();
      }

      if(this.timelayer_imazon && GFW.app.currentBaseLayer !== "imazon") {
        this.timelayer_imazon.hide();
        TimelineImazon.hide();
      }

      if (this.timelayer_loss && GFW.app.currentBaseLayer !== "loss") {
        this.timelayer_loss.hide();
        TimelineLoss.hide();
      }
    },

    _loadBaseLayer: function() {
      if (this.currentBaseLayer === "forma") {
        if (!this.timelayer) {
          this._loadTimeLayer();
        } else {
          this.timelayer.show();
          this.timeline.show();
        }

        return;
      } else if (this.currentBaseLayer === "modis") {
        if (!this.timelayer_modis) {
          this._loadTimeLayerModis();
        } else {
          this.timelayer_modis.show();
          this.timeline_modis.show();
        }

        return;
      } else if (this.currentBaseLayer === "imazon") {
        if (!this.timelayer_imazon) {
          this._loadTimeLayerImazon();
        } else {
          this.timelayer_imazon.show();
          this.timeline_imazon.show();
        }

        return;
      } else if (this.currentBaseLayer === "loss") {
        if (!this.timelayer_loss) {
          this._loadTimeLayerLoss();
        } else {
          this.timelayer_loss.show();
          this.timeline_loss.show();
        }

        return;
      }
    },

    _loadTimeLayer: function() {
      setTimeout(function(){
        if (!document.getElementById('cartodb_logo')) {
          var cartodb_link = document.createElement("a");
          cartodb_link.setAttribute('id','cartodb_logo');
          cartodb_link.setAttribute('style',"position:absolute; bottom:3px; left:74px; display:block; border:none; z-index:100");
          cartodb_link.setAttribute('href','http://www.cartodb.com');
          cartodb_link.setAttribute('target','_blank');
          cartodb_link.innerHTML = "<img src='http://cartodb.s3.amazonaws.com/static/new_logo.png' alt='CartoDB' title='CartoDB' style='border:none;' />";
          map.getDiv().appendChild(cartodb_link)
        }
      }, 2000);

      this.timelayer = new TimePlayer('gfw2_forma', this.global_version, this.cloudfront_url);
      this.timelayer.options.table_name = null;
      this._map.overlayMapTypes.push(this.timelayer);

      // this.timeline.show();

      // this.timeline.bind('change_date', function(start_month, end_month, year) {
      //   that.timelayer.setStart_time(start_month);
      //   that.timelayer.setTime(end_month, year);
      // });

      // this.timeline.loadDefaultRange();
    },

    _mapLoaded: function() {
      if (!config.mapLoaded) {
        config.mapLoaded = true;

        GFW.app._loadBaseLayer();

        if (!$(".filters").hasClass("hide")) Filter.show();
      }
    }
  });
};


GFW.modules.maplayer = function(gfw) {
  gfw.maplayer = {};

  gfw.maplayer.Engine = Class.extend({
    init: function(layer, map) {
      this.layer = layer;
      this._map = map;

      var sw = new google.maps.LatLng(this.layer.get('ymin'), this.layer.get('xmin'));
      var ne = new google.maps.LatLng(this.layer.get('ymax'),this.layer.get('xmax'));
      this._bounds = new google.maps.LatLngBounds(sw, ne);

      if (this.layer.get('slug') !== 'forma'){
        this.layer.attributes['visible'] = false;
      }

      if (config.MAPOPTIONS.layers) {
        var filters = _.map(config.MAPOPTIONS.layers.split(","), function(i) {
          return parseInt(i, 10);
        });
      }

      this._addControl(filters);
    },

    _addControl: function(filters) {
      var that = this;

      var clickEvent = function() {
        that._toggleLayer();
      };

      if (this.layer.get('slug') === "biome") {
        GFW.app.biomeLayer = this.layer;
      }

      if (this.layer.get('slug') === "nothing") {
        var event = function() {
          GFW.app._hideBiomeLayer(GFW.app.biomeLayer);
          GFW.app.currentBaseLayer = null;
          that._hideBaseLayers(GFW.app);
        };

        Filter.addFilter(
          "",
          this.layer.get('slug'),
          this.layer.get('category_name'),
          this.layer.get('title'),
          {
            clickEvent: event,
            source: null,
            category_color: this.layer.get("category_color"),
            color: this.layer.get("title_color")
          }
        );
      } else if (this.layer.get('slug') === "user_stories") {
        var customEvent = function() {
          GFW.app._toggleStoriesLayer(that.layer.get('id'));
          legend.toggleItem(that.layer.get('id'), that.layer.get('category_slug'), that.layer.get('category_name'),  that.layer.get('title'), that.layer.get('slug'), that.layer.get('category_color'), that.layer.get('title_color'));

          if(!GFW.app.storiesLoaded) {
            GFW.app._loadStoriesLayer();
          }
        };

        Filter.addFilter(this.layer.get('id'), this.layer.get('slug'), this.layer.get('category_name'), this.layer.get('title'), { clickEvent: customEvent, source: null, category_color: this.layer.get("category_color"), color: this.layer.get("title_color") });

        if (_.include(filters, this.layer.get('id'))) {
          GFW.app._loadStoriesLayer();
          Filter.check(this.layer.get('id'));
          legend.toggleItem(this.layer.get('id'), this.layer.get('category_slug'), this.layer.get('category_name'),  this.layer.get('title'), this.layer.get('slug'), this.layer.get('category_color'), this.layer.get('title_color'));
        }
      } else if (this.layer.get('slug') === "mongabay") {
        var mongabayEvent = function() {
          GFW.app._toggleMongabayLayer(that.layer.get('id'));
          legend.toggleItem(that.layer.get('id'), that.layer.get('category_slug'), that.layer.get('category_name'),  that.layer.get('title'), that.layer.get('slug'), that.layer.get('category_color'), that.layer.get('title_color'));
        };

        Filter.addFilter(this.layer.get('id'), this.layer.get('slug'), this.layer.get('category_name'), this.layer.get('title'), { clickEvent: mongabayEvent, source: null, category_color: this.layer.get("category_color"), color: this.layer.get("title_color") });

        if (_.include(filters, this.layer.get('id'))) {
          GFW.app._loadMongabayLayer();
          Filter.check(this.layer.get('id'));
          legend.toggleItem(this.layer.get('id'), this.layer.get('category_slug'), this.layer.get('category_name'),  this.layer.get('title'), this.layer.get('slug'), this.layer.get('category_color'), this.layer.get('title_color'));
        }
      } else if (this.layer.get('slug') == "annual") {
        Filter.addFilter(this.layer.get('id'), this.layer.get('slug'), this.layer.get('category_name'), this.layer.get('title'), { disabled: true });
      } else if (this.layer.get('slug') === 'brazilian_amazon' || this.layer.get('slug') === 'quarterly' || this.layer.get('slug') === 'forestgain' || this.layer.get('slug') === 'fires') {
        var biomeEvent = function() {
          that._toggleLayer();
          GFW.app._hideBiomeLayer(GFW.app.biomeLayer);
        };

        Filter.addFilter(this.layer.get('id'), this.layer.get('slug'), this.layer.get('category_name'), this.layer.get('title'), { clickEvent: biomeEvent, source: this.layer.get('slug'), category_color: this.layer.get("category_color"), color: this.layer.get("title_color") });
      } else {
        Filter.addFilter(this.layer.get('id'), this.layer.get('slug'), this.layer.get('category_name'), this.layer.get('title'), { clickEvent: clickEvent, source: this.layer.get('source'), category_color: this.layer.get("category_color"), color: this.layer.get("title_color") });

        // Adds the layers from the hash
        if (filters && _.include(filters, this.layer.get('id'))) {

          if (GFW.app) {
            GFW.app._loadLayer(this.layer);
          } else {
            config.pendingLayers.push(this.layer);
          }

        } else if (this.layer.get('table_name') == 'gfw2_forma') {
          // legend.toggleItem(this.layer.get('id'), this.layer.get('category_slug'), this.layer.get('category_name'),  this.layer.get('title'), this.layer.get('slug'), this.layer.get('category_color'), this.layer.get('title_color'));
        }
      }
    },

    _hideBaseLayers: function(){
      // this.$map_coordinates.show();
      // this.updateCoordinates(this._map.getCenter());

      GFW.app.currentBaseLayer = null;
      GFW.app._toggleTimeLayer();
      // legend.removeCategory("forest_change");

      if (GFW.app.baseLayer) GFW.app.baseLayer.setOptions({ opacity: 0 });
    },

    _toggleLayer: function(){
      var self = this;

      if(this.layer.attributes['disabled']) {
        return false;
      }

      this.layer.attributes['visible'] = !this.layer.attributes['visible'];

      var
      slug            = this.layer.get('slug'),
      title           = this.layer.get('title'),
      title_color     = this.layer.get('title_color'),
      title_subs      = this.layer.get('title_subs'),
      visible         = this.layer.get('visible'),
      tableName       = this.layer.get('table_name'),
      category        = this.layer.get('category_name'),
      category_slug   = this.layer.get('category_slug'),
      category_color  = this.layer.get('category_color'),
      id              = this.layer.get('id');

      if (category === null || !category) { // Default data
        category       = 'Conservation';
        category_slug  = 'conservation';
        category_color = '#707D92';
      }

      var // special layers
      biome         = GFW.app.datalayers.LayersObj.get(585),
      forma         = GFW.app.datalayers.LayersObj.get(569),
      modis         = GFW.app.datalayers.LayersObj.get(588),
      imazon        = GFW.app.datalayers.LayersObj.get(584);
      fires         = GFW.app.datalayers.LayersObj.get(593);
      forestgain    = GFW.app.datalayers.LayersObj.get(594);
      loss          = GFW.app.datalayers.LayersObj.get(595);

      if (category != 'Forest change' || slug === 'biome') {
        legend.toggleItem(id, category_slug, category, title, slug, category_color, title_color);
      }

      if (slug === 'forma' || slug === "modis" || slug === "imazon" || slug === "fires" || slug === "forestgain" || slug === "loss") {
        if (slug === 'forma') {
          forma.attributes['visible'] = true;
          biome.attributes['disabled'] = false;

          // Timeline.show();
          // analysis.info.model.set("dataset", "forma");

          Filter.enableBiome();
        } else {
          // Timeline.hide();
        }

        if (slug === 'modis') {
          modis.attributes['visible'] = true;

          // TimelineModis.show();
          // analysis.info.model.set("dataset", "modis");
        } else {
          // TimelineModis.hide();
        }

        if (slug === 'imazon') {
          imazon.attributes['visible'] = true;

          // TimelineImazon.show();
          // analysis.info.model.set("dataset", "imazon");
        } else {
          // TimelineImazon.hide();
        }

        if (slug === 'loss') {
          // Timeline.show();
          //analysis.info.model.set("dataset", "forest_loss");
        } else {
          // Timeline.hide();
        }

        if (slug == 'forestgain') {
          GFW.app._addLayer(this.layer);
        } else {
          forestgain && GFW.app._removeLayer(forestgain);
        }

        GFW.app.currentBaseLayer = slug;
        GFW.app._updateBaseLayer();

        legend.replace(id, category_slug, category, title, slug, category_color, title_color);
      } else {
        if (visible) {
          GFW.app._addLayer(this.layer);
        } else {
          GFW.app._removeLayer(this.layer);
        }

        Filter.toggle(id);
      }
    }
  });
};


GFW.modules.datalayers = function(gfw) {
  gfw.datalayers = {};

  gfw.datalayers.Engine = Class.extend({
    init: function(CartoDB, layerTable, map) {
      this._map         = map;
      this._bycartodbid = {};
      this._bytitle     = {};
      this._dataarray   = [];
      this._cartodb     = CartoDB;

      var LayersColl = this._cartodb.CartoDBCollection.extend({
        sql: function(){
          return "SELECT cartodb_id AS id, slug, title, title_color, title_subs, table_name, source, category_color, category_slug, category_name, external, zmin, zmax, ST_XMAX(the_geom) AS xmax, \
            ST_XMIN(the_geom) AS xmin, ST_YMAX(the_geom) AS ymax, ST_YMIN(the_geom) AS ymin, tileurl, true AS visible \
            FROM " + layerTable + " \
            WHERE display = TRUE ORDER BY displaylayer,title ASC";
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
          if(p.get('slug') === 'user_stories') {
            Filter.addFilter(0, 'nothing', 'People', 'Stay tuned', { disabled: true , category_color: "#707D92", color: "#707D92" });
          }

          that._addLayer(p);
        });
      });
    },

    _addLayer: function(p) {
      var layer = new gfw.maplayer.Engine(p, this._map);
    }
  });
};


/**
* Logging module that gfwtes log messages to the console and to the Speed
* Tracer API. It contains convenience methods for info(), warn(), error(),
* and todo().
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
    }
  };
};
