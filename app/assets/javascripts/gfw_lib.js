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
        layerTable : 'layerinfo_minus_imazon' // TODO: change back to layerinfo when we have imazon
      });

      this.timeLayerPosition = null;

      this._precision = 2;
      this._layers = [];
      this._cloudfront_url = "dyynnn89u7nkm.cloudfront.net";
      this._global_version = 14;

      gfw.log.enabled = options ? options.logging: false;

      this._map = map;

      this.infowindow          = new CartoDBInfowindow(map);
      this.protectedInfowindow = new ProtectedInfowindow(map);

      this.queries = {};
      this.storiesMarkers = [];
      this.storiesFeatures = [];
      this.storiesLoaded = false;

      // we can stop loading the blank (see limit=0 below) tileset here now that we are loading the animation. see todo on line 347
      this.queries.semi_monthly     = "SELECT cartodb_id,alerts,z,the_geom_webmercator FROM gfw2_forma WHERE z=CASE WHEN 8 < {Z} THEN 17 ELSE {Z}+8 END limit 0";
      this.queries.annual           = "SELECT cartodb_id,alerts,z,the_geom_webmercator FROM gfw2_hansen WHERE z=CASE WHEN 9 < {Z} THEN 17 ELSE {Z}+8 END";
      this.queries.quarterly        = "SELECT cartodb_id,alerts,z,the_geom_webmercator FROM gfw2_hansen WHERE z=CASE WHEN 9 < {Z} THEN 17 ELSE {Z}+8 END";
      this.queries.brazilian_amazon = "SELECT CASE WHEN {Z}<12 THEN st_buffer(the_geom_webmercator,(16-{Z})^3.8) ELSE the_geom_webmercator END the_geom_webmercator, stage, cartodb_id FROM gfw2_imazon WHERE year = 2012";

      this.lastHash = null;

      this._cartodb   = Backbone.CartoDB({ user: this.options.user });
      this.datalayers = new gfw.datalayers.Engine(this._cartodb, options.layerTable, this._map);

      // Layers
      this.mainLayer        = null;
      this.specialLayer     = null;
      this.imazonLayer      = null;
      this.currentBaseLayer = "semi_monthly";

      this._setupZoom();

      google.maps.event.addDomListener(this._map, 'mousemove', function(event) {
        Timeline.updateCoordinates(event.latLng);
      });

    },

    // Loads single layer
    _loadLayer: function(layer) {
      var id = layer.get('id');

      GFW.app._addLayer(layer);
      layer.attributes["visible"] = true;

      Filter.check(id);
      legend.toggleItem(id, layer.get('category_slug'), layer.get('category_name'),  layer.get('title'), layer.get('slug'), layer.get('category_color'), layer.get('title_color'));

    },

    run: function() {
      this._setupListeners();
      gfw.log.info('App is now running!');
    },

    open: function() {
      var that = this;

      var
      dh = $(window).height(),
      hh = $("header").height();

      $("#map").animate({ height: dh - hh }, 250, function() {
        google.maps.event.trigger(that._map, "resize");
        that._map.setOptions({ scrollwheel: false });
      });
    },

    close: function(callback) {
      var that = this;

      $("#map").animate({ height: 400 }, 250, function() {
        google.maps.event.trigger(that._map, "resize");
        callback && callback();
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

      // Setup listeners
      google.maps.event.addListener(this._map, 'zoom_changed', function() {
        that._updateHash(that);
        that._refreshBaseLayer();
      });

      google.maps.event.addListener(this._map, 'dragend', function() {
        that._updateHash(that);
      });

      google.maps.event.addListener(this._map, 'click', function(event) {

        that.infowindow.close();
        that.protectedInfowindow.close();

        if (!that.specialLayer) { return; }

        var // get click coordinates
        lat = event.latLng.lat(),
        lng = event.latLng.lng(),
        url = 'http://protectedplanet.net/api/sites_by_point/'+lng+'/'+lat;

        $.ajax({
          async: false,
          dataType: "jsonp",
          jsonpCallback:'iwcallback2',
          crossDomain: true,
          url: url,
          error: function(xhr, status, c) {
            console.log("Error", xhr, status, c);
          },
          success: function(json) {

            if (!json) return;

            var data = json[0];

            if (data) {
              that.protectedInfowindow.setContent(data);
              that.protectedInfowindow.setPosition(event.latLng);
              that.protectedInfowindow.open();
            }

          }
        });
      });


      google.maps.event.addListener(this._map, 'tilesloaded', this._mapLoaded);

    },

    _removeLayer: function(layer) {

      if (!layer.get('external')) {

        this._layers = _.without(this._layers, layer.get("table_name"));
        this._renderLayers();

      } else {
        this._removeExternalLayer();
      }

      this._refreshTimeLine();

    },

    _addLayer: function(layer) {

      if (layer.get("external")) {

        var table_name = layer.get("table_name");

        if (table_name == "protected_areas") {
          this._renderExternalLayer(layer);
        } else if (table_name == "gfw2_imazon") {
          this._renderImazonLayer(layer);
        }

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

    _removeExternalLayer: function(layer) {
      if (this.specialLayer) {
        this.specialLayer.setOpacity(0);
        this.specialLayer = null;
      }
    },

    _renderExternalLayer: function(layer) {
      var that = this;

      var query = layer.get('tileurl');

      if (this.specialLayer) {
        this.specialLayer.setOpacity(1);
      } else {

        this.specialLayer = new google.maps.ImageMapType({
          getTileUrl: function(tile, zoom) {
            return "http://184.73.201.235/blue/" + zoom + "/" + tile.x + "/" + tile.y;
          },
          tileSize: new google.maps.Size(256, 256),
          opacity:0.60,
          isPng: true
        });

        map.overlayMapTypes.push(this.specialLayer);
      }

    },

    _renderImazonLayer: function(layer) {
      var that = this;

      this.imazonLayer = new google.maps.FusionTablesLayer({
        query: {
          select: "geo",
          from: "2949980",
          where: "type = '7'"
        },
        suppressInfoWindows:true,
        styles: [
          { polygonOptions: {fillColor:'#333333',fillOpacity:0.1,strokeColor:'#333333',strokeWeight:2,strokeOpacity:0.6    }}
        ],
        map: this._map
      });

    },

    _removeImazonLayer: function(layer) {
      if (this.imazonLayer) {
        this.imazonLayer.setOpacity(0);
        this.imazonLayer = null;
      }
    },

    _renderLayers: function() {

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
          layer_order: "bottom",
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

    _onMainLayerClick: function(ev, latlng, pos, data) {

      var that = this;

      //we needed the cartodb_id and table name
      var pair = data.cartodb_id.split(':');

      if(pair[1] === 'world_ifl') return;

      //here i make a crude request for the columns of the table
      //nulling out the geoms to save payload
      var request_sql = "SELECT *, null as the_geom, null as the_geom_webmercator FROM " + pair[1] + " WHERE cartodb_id = " + pair[0];
      var url = 'http://dyynnn89u7nkm.cloudfront.net/api/v2/sql?q=' + encodeURIComponent(request_sql);

      $.ajax({
        async: false,
        dataType: 'jsonp',
        crossDomain: true,
        //jsonp:false,
        jsonpCallback:'iwcallback',
        url: url,
        error: function(xhr, status, c) {
          console.log("Error", xhr, status, c);
        },
        success: function(json) {

          if (!json || (json && !json.rows)) return;

          delete json.rows[0]['cartodb_id'],
          delete json.rows[0]['the_geom'];
          delete json.rows[0]['the_geom_webmercator'];
          delete json.rows[0]['created_at'];
          delete json.rows[0]['updated_at'];

          var data = json.rows[0];

          for (var key in data) {
            var temp;
            if (data.hasOwnProperty(key)) {
              temp = data[key];
              delete data[key];
              key = key.replace(/_/g,' '); //add spaces to key names
              data[key.charAt(0).toUpperCase() + key.substring(1)] = temp; //uppercase
            }
          }

          if (data) {
            GFW.app.infowindow.setContent(data);
            GFW.app.infowindow.setPosition(latlng);
            GFW.app.infowindow.open();
          }

        }
      });

    },

    _refreshBaseLayer: function() {

      if (GFW.app.baseLayer && GFW.app.currentBaseLayer != "semi_monthly") {

        try {
          var query = GFW.app.queries[GFW.app.currentBaseLayer].replace(/{Z}/g, GFW.app._map.getZoom());
          GFW.app.baseLayer.setQuery(query);
        }
        catch(err) { }
      }

    },

    _getTableName: function(layerName) {

      if (layerName === "semi_monthly") {
        return 'gfw2_forma';
      } else if (layerName === "annual") {
        return 'gfw2_hansen';
      } else if (layerName === "quarterly") {
        return 'gfw2_hansen';
      } else if (layerName === "brazilian_amazon") {
        return 'gfw2_imazon';
      }
      return null;
    },

    _updateBaseLayer: function() {

      if (GFW.app.baseLayer && GFW.app.currentBaseLayer != "semi_monthly") {

        this._toggleTimeLayer();
        this._loadBaseLayer();

      } else {

        if (GFW.app.currentBaseLayer != "semi_monthly") this._toggleTimeLayer();
        else GFW.app.baseLayer && GFW.app.baseLayer.setMap(null);

        this._loadBaseLayer();

      }

    },

    _toggleStoriesLayer: function() {
      _.each(this.storiesFeatures, function(feature) {
        if (feature.visible) feature.setVisible(false);
        else feature.setVisible(true);
      });

      _.each(this.storiesMarkers, function(marker) {
        marker.toggle();
      });

      Filter.toggle(0);
    },

    _loadStoriesLayer: function() {
      var that = this;

      $.ajax({
        async: false,
        url: "/stories.json?for-map=true",
        success: function(data) {

          _.each(data, function(story) {

            var
            position = new google.maps.LatLng(story.lat, story.lng),
            thumb    = story.thumbnail_url,
            icon     = '/assets/icons/exclamation.png',
            properties = null;

            var geometry = JSON.parse(story.geometry)
            var feature = new GeoJSON(geometry, config.OVERLAYS_STYLE);

            if (feature.length > 0) {
              feature[0].setMap(map);
              that.storiesFeatures.push(feature[0]);
            }

            var title = story.title;

            if (title.length > 34) {
              title = $.trim(title).substring(0, 34).split(" ").slice(0, -1).join(" ") + "...";
            }

            var content = "<strong><a href='/stories/"+ story.id +"'>" + title + "</a></strong> <span>by " + story.name + " &middot; </span><a href='/stories/"+ story.id +"'>read more</a>";

            marker = new GFWMarker({ position: position, icon: icon, thumbnail_url: story.thumbnail_url, content: content });
            marker.setMap(map);
            that.storiesMarkers.push(marker);
          });

          that.storiesLoaded = true;
        }
      });
    },

    _toggleTimeLayer: function() {

      if (this.time_layer) {

        if (GFW.app.currentBaseLayer != "semi_monthly") {
          this.time_layer.hide();
          Timeline.hide();
        } else {
          this.time_layer.show();
          Timeline.show();
        }

      }

    },

    _loadTimeLayer: function() {
      var that = this;

      if ($.browser.msie) {
        this.time_layer = new StaticGridLayer({
          map: that._map,
          _global_version: that._global_version,
          _cloudfront_url: that._cloudfront_url
        });

        window.time_layer = this.time_layer;

      } else {
        this.time_layer = new TimePlayer('gfw2_forma', this._global_version, this._cloudfront_url);
        this.time_layer.options.table_name = null;
        map.overlayMapTypes.push(this.time_layer);
        window.time_layer = this.time_layer;

      }

      Timeline.show();

      Timeline.bind('change_date', function(start_month, end_month, year) {
        self.time_layer.set_start_time(start_month);
        self.time_layer.set_time(end_month, year);
      });

      Timeline.loadDefaultRange();

    },

    _loadBaseLayer: function() {

      var self = this;
      var table_name = null;

      if (this.currentBaseLayer === "semi_monthly") {

        if (config.mapLoaded && !this.time_layer) {

          this._loadTimeLayer();

        } else {

          if (this.time_layer) {
            this.time_layer.show();
            Timeline.show();
          }

        }

        return;
      } else if (this.currentBaseLayer === "annual") {
        table_name = 'gfw2_hansen';
      } else if (this.currentBaseLayer === "quarterly") {
        table_name = 'gfw2_hansen';
      } else if (this.currentBaseLayer === "brazilian_amazon") {
        table_name = 'gfw2_imazon';
      }

      this.baseLayer = new CartoDBLayer({
        map: map,
        user_name:'',
        tiler_domain:'dyynnn89u7nkm.cloudfront.net',
        sql_domain:'dyynnn89u7nkm.cloudfront.net',
        tiler_path:'/tiles/',
        extra_params:{ v: this._global_version}, //define a verison number on requests
        tiler_suffix:'.png',
        table_name: this._getTableName(this.currentBaseLayer),
        query: this.queries[this.currentBaseLayer].replace(/{Z}/g, this._map.getZoom()),
        layer_order: "top",
        auto_bound: false
      });

    },

    _mapLoaded: function(){

      GFW.app._toggleTimeLayer();

      if (!config.mapLoaded) {
        config.mapLoaded = true;
        GFW.app._loadBaseLayer();

        if (showMap) Filter.show();

      }

    },

    _updateHash: function(self) {
      var
      hash,
      zoom = self._map.getZoom(),
      lat  = self._map.getCenter().lat().toFixed(GFW.app._precision),
      lng  = self._map.getCenter().lng().toFixed(GFW.app._precision);

      var layers = config.mapOptions.layers;

      if (layers) {
        hash = "map/" + zoom + "/" + lat + "/" + lng + "/" + config.iso + "/" + layers;
      } else {
        hash = "map/" + zoom + "/" + lat + "/" + lng + "/" + config.iso + "/";
      }

      window.router.navigate(hash);

    },
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

        if (this.layer.get('slug') != 'semi_monthly'){
          this.layer.attributes['visible'] = false;
        }

        if (config.mapOptions.layers) {
          var filters = _.map(config.mapOptions.layers.split(","), function(i) { return parseInt(i, 10); });
        }

        this._addControl(filters);

      },


      _addControl: function(filters){
        var that = this;

        var clickEvent = function() {
          that._toggleLayer();
        };


        if (this.layer.get('slug') == "nothing") {
          var event = function() {
            GFW.app.currentBaseLayer = null;
            that._hideBaseLayers(GFW.app);
          };

          Filter.addFilter("", this.layer.get('slug'), this.layer.get('category_name'), this.layer.get('title'), { clickEvent: event, source: null, category_color: this.layer.get("category_color"), color: this.layer.get("title_color") });

        } else if (this.layer.get('slug') == "user_stories") {
          var customEvent = function() {
            GFW.app._toggleStoriesLayer();
            legend.toggleItem(that.layer.get('id'), that.layer.get('category_slug'), that.layer.get('category_name'),  that.layer.get('title'), that.layer.get('slug'), that.layer.get('category_color'), that.layer.get('title_color'));

            if(!GFW.app.storiesLoaded) {
              GFW.app._loadStoriesLayer();
            }
          };

          Filter.addFilter(this.layer.get('id'), this.layer.get('slug'), this.layer.get('category_name'), this.layer.get('title'), { clickEvent: customEvent, source: null, category_color: this.layer.get("category_color"), color: this.layer.get("title_color") }, true);

          if(!_.include(filters, 0)) {
            GFW.app._loadStoriesLayer();
            Filter.check(this.layer.get('id'));
            legend.toggleItem(this.layer.get('id'), this.layer.get('category_slug'), this.layer.get('category_name'),  this.layer.get('title'), this.layer.get('slug'), this.layer.get('category_color'), this.layer.get('title_color'));
          } else {
            Filter.fakeCheck(0);
          }
        } else if (this.layer.get('slug') == "annual" || this.layer.get('slug') == "quarterly" || this.layer.get('slug') == "brazilian_amazon") {
          Filter.addFilter(this.layer.get('id'), this.layer.get('slug'), this.layer.get('category_name'), this.layer.get('title'), { disabled: true, category_color: this.layer.get("category_color"), color: this.layer.get("title_color") });
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
            legend.toggleItem(this.layer.get('id'), this.layer.get('category_slug'), this.layer.get('category_name'),  this.layer.get('title'), this.layer.get('slug'), this.layer.get('category_color'), this.layer.get('title_color'));
          }
        }

      },

      _bindDisplay: function(display) {
        display.setEngine(this);
      },

      _hideBaseLayers: function(){

        GFW.app.currentBaseLayer = null;
        GFW.app._toggleTimeLayer();
        legend.removeCategory("forest_clearing");

        if (GFW.app.baseLayer) GFW.app.baseLayer.setOptions({ opacity: 0 });

      },

      _toggleLayer: function(){

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
        visibility      = this.layer.get('visible');
        id              = this.layer.get('id');

        if (category === null || !category) { // Default data
          category       = 'Conservation';
          category_slug  = 'conservation';
          category_color = '#707D92';
        }

        var // special layers
        semi_monthly  = GFW.app.datalayers.LayersObj.get(569),
        annual        = GFW.app.datalayers.LayersObj.get(568),
        quarterly     = GFW.app.datalayers.LayersObj.get(583),
        sad           = GFW.app.datalayers.LayersObj.get(567);

        if (category != 'Forest clearing') {
          legend.toggleItem(id, category_slug, category, title, slug, category_color, title_color);
        }

        if (slug === 'semi_monthly' || slug === "annual" || slug === "quarterly" || slug === "brazilian_amazon") {

          if (slug === 'semi_monthly' && showMap) {
            Timeline.show();
          } else {
            Timeline.hide();
          }

          GFW.app.currentBaseLayer = slug;

          GFW.app._updateBaseLayer();

          if (slug == 'semi_monthly') {
            semi_monthly.attributes['visible'] = true;
          } else if (slug == 'annual') {
            annual.attributes['visible']       = true;
          } else if (slug == 'quarterly') {
            annual.attributes['visible']       = true;
          } else if (slug == 'brazilian_amazon') {
            sad.attributes['visible']          = true;
          }

          legend.replace(id, category_slug, category, title, slug, category_color, title_color);

        } else {

          if (visible) {
            GFW.app._addLayer(this.layer);
          } else {
            GFW.app._removeLayer(this.layer);
          }

          // We don't store the id of the user_stories layer in the URL
          if (slug != 'user_stories') {
            Filter.toggle(id);
          }

        }

      }
    });

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
            that._addLayer(p);
          });

          // TODO: remove the below when real layers arrive
          Filter.addFilter(0, 'nothing', 'Regrowth', 'Stay tuned',     { disabled: true , category_color: "#B2D26E", color: "#B2D26E" });
          // Filter.addFilter(0, 'nothing', 'Conservation', 'Stay tuned', { disabled: true , category_color: "#CCC",    color: "#CCC"});
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
    }
  };
};
