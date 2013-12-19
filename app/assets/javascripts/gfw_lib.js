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
      var that = this;

      this.options = _.defaults(options, {
        user       : 'gfw-01',
        layerTable : 'layerinfo_minus_imazon' // TODO: change back to layerinfo when we have imazon
      });

      this.timeLayerPosition = null;

      this._precision = 2;
      this._layers = [];
      this._cloudfront_url = "dyynnn89u7nkm.cloudfront.net";
      this._global_version = 34;

      gfw.log.enabled = options ? options.logging: false;

      this._map = map;
      this.$map_coordinates = $(".map_coordinates");

      this.infowindow          = new CartoDBInfowindow(map);
      this.protectedInfowindow = new ProtectedInfowindow(map);

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
      this.queries.semi_monthly     = "SELECT cartodb_id,alerts,z,the_geom_webmercator FROM gfw2_forma WHERE z=CASE WHEN 8 < {Z} THEN 17 ELSE {Z}+8 END limit 0";
      this.queries.annual           = "SELECT cartodb_id,alerts,z,the_geom_webmercator FROM gfw2_hansen WHERE z=CASE WHEN 9 < {Z} THEN 17 ELSE {Z}+8 END";
      this.queries.quarterly        = "SELECT cartodb_id,the_geom_webmercator FROM modis_forest_change_copy";
      this.queries.brazilian_amazon = "SELECT cartodb_id,type,the_geom_webmercator FROM imazon_clean";
      this.queries.fires            = "SELECT cartodb_id,the_geom_webmercator FROM global_7d";

      this.lastHash = null;

      this._cartodb   = Backbone.CartoDB({ user: this.options.user });
      this.datalayers = new gfw.datalayers.Engine(this._cartodb, options.layerTable, this._map);

      // Layers
      this.mainLayer        = null;
      this.specialLayer     = null;
      this.pantropicalLayer = null;
      this.forest2000Layer  = null;
      this.forestGainLayer  = null;
      this.currentBaseLayer = "semi_monthly";

      this._setupZoom();

      google.maps.event.addDomListener(this._map, 'dragend', function(event) {
        Timeline.updateCoordinates(that._map.getCenter());
        TimelineNotPlayer.updateCoordinates(that._map.getCenter());
        TimelineImazon.updateCoordinates(that._map.getCenter());
        that.updateCoordinates(that._map.getCenter());
      });

      google.maps.event.addListener(this._map, 'center_changed', function(event) {
        Timeline.updateCoordinates(that._map.getCenter());
        TimelineNotPlayer.updateCoordinates(that._map.getCenter());
        TimelineImazon.updateCoordinates(that._map.getCenter());
        that.updateCoordinates(that._map.getCenter());
      });

      google.maps.event.addListener(this._map, 'zoom_changed', function(event) {
        Timeline.updateCoordinates(that._map.getCenter());
        TimelineNotPlayer.updateCoordinates(that._map.getCenter());
        TimelineImazon.updateCoordinates(that._map.getCenter());
        that.updateCoordinates(that._map.getCenter());
      });
    },

    updateCoordinates: function(latLng) {

      var lat = parseFloat(latLng.lat());
      var lng = parseFloat(latLng.lng());

      lat = lat.toFixed(6);
      lng = lng.toFixed(6);

      if (this.$map_coordinates) {
        this.$map_coordinates.html("Lat/Long: "+lat + "," + lng);
      }

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
      dh = $(window).height() + 67,
      hh = $("header").height();

      $("#map").animate({ height: dh - hh }, 250, function() {
        google.maps.event.trigger(that._map, "resize");
        that._map.setOptions({ scrollwheel: true });
      });

      this.goTo($("#map"), {margin: "67"});
    },

    close: function(callback) {
      var that = this;

      $("#map").animate({ height: 400 }, 250, function() {
        google.maps.event.trigger(that._map, "resize");
        that._map.setOptions({ scrollwheel: false });
        callback && callback();
      });

      this.goTo($("body"));
    },

    goTo: function($el, opt, callback) {
      if ($el) {
        var speed  = (opt && opt.speed)  || 400;
        var delay  = (opt && opt.delay)  || 100;
        var margin = (opt && opt.margin) || 0;

        $('html, body').delay(delay).animate({scrollTop:$el.offset().top - margin}, speed);
        callback && callback();
      }
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
        params = {lat:lat, lon:lng},
        url = 'http://wip.gfw-apis.appspot.com/wdpa/sites';

        executeAjax(url, params, {
          success: function(sites) {
            var site = null;
            if (sites && sites.length > 0) {
              site = sites[0];
              that.protectedInfowindow.setContent(site);
              that.protectedInfowindow.setPosition(event.latLng);
              that.protectedInfowindow.open();
            }
          },
          error: function(e) {
            console.error('WDPA API call failed', e, url);
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
        if(layer.get('slug') === 'forest2000') {
          this._removeForest2000Layer();
        } else if(layer.get('slug') === 'forestgain') {
          this._removeForestGainLayer();
        } else if(layer.get('slug') === 'pantropical') {
          this._removePantropicalLayer();
        } else {
          this._removeExternalLayer();
        }
      }

      this._refreshTimeLine();

    },

    _addLayer: function(layer) {

      if (layer.get("external")) {

        var table_name = layer.get("table_name");
        if (table_name == "protected_areas") { this._renderExternalLayer(layer); }
        if (table_name == "pantropical") { this._renderPantropicalLayer(layer); }
        if (table_name == "forest2000") { this._renderForest2000Layer(layer); }
        if (table_name == "forestgain") { this._renderForestGainLayer(layer); }

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

    _onMainLayerClick: function(ev, latlng, pos, data) {
      var that = this;

      //we needed the cartodb_id and table name
      var pair = data.cartodb_id.split(':');

      if(pair[1] === 'world_ifl') return;

      //here i make a crude request for the columns of the table
      //nulling out the geoms to save payload
      var request_sql = "SELECT *, null as the_geom, null as the_geom_webmercator FROM " + pair[1] + " WHERE cartodb_id = " + pair[0];
      var url = 'http://dyynnn89u7nkm.cloudfront.net/api/v2/sql?q=' + encodeURIComponent(request_sql);

      var makeSuccessCallback = function(pairs) {

        return function(json) {

          if (!json || (json && !json.rows)) return;

          delete json.rows[0]['cartodb_id'],
          delete json.rows[0]['the_geom'];
          delete json.rows[0]['the_geom_webmercator'];
          delete json.rows[0]['created_at'];
          delete json.rows[0]['updated_at'];

          var data = _.clone(json.rows[0]);
          var content_data = json.rows[0];

          for (var key in content_data) {
            var temp;

            if (content_data.hasOwnProperty(key)) {
              temp = content_data[key];
              delete content_data[key];
              key = key.replace(/_/g,' '); //add spaces to key names
              content_data[key.charAt(0).toUpperCase() + key.substring(1)] = temp; //uppercase
            }
          }

          if (data) {

            if ( pair[1] == 'biodiversity_hotspots' ) {
              GFW.app.infowindow.setMode("image")
              GFW.app.infowindow.setVisibleColumns(["description"]);
              GFW.app.infowindow.setContent(data);
            } else {
              GFW.app.infowindow.setMode("normal")
              GFW.app.infowindow.setVisibleColumns();
              GFW.app.infowindow.setContent(content_data);
            }

            GFW.app.infowindow.setPosition(latlng);
            GFW.app.infowindow.open();
          }

        }
      }

      var onSuccess = makeSuccessCallback(pair);

      $.ajax({
        async: false,
        dataType: 'jsonp',
        crossDomain: true,
        jsonpCallback:'iwcallback',
        url: url,
        success: onSuccess,
        error: function(xhr, status, c) {
          console.log("Error", xhr, status, c);
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
        return 'modis_forest_change_copy';
      } else if (layerName === "brazilian_amazon") {
        return 'imazon_clean';
      } else if (layerName === "fires") {
        return 'global_7d';
      }

      return null;
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

    _toggleStoriesLayer: function(id) {
      _.each(this.storiesFeatures, function(feature) {
        if (feature.visible) feature.setVisible(false);
        else feature.setVisible(true);
      });

      _.each(this.storiesMarkers, function(marker) {
        marker.toggle();
      });

      Filter.toggle(id);
    },

    _hideStoriesMarkers: function() {
      _.each(this.storiesFeatures, function(feature) {
        if (feature.visible) feature.setVisible(false);
      });

      _.each(this.storiesMarkers, function(marker) {
        marker.hide();
      });
    },

    _showStoriesMarkers: function() {
      _.each(this.storiesFeatures, function(feature) {
        if (!feature.visible) feature.setVisible(true);
      });

      _.each(this.storiesMarkers, function(marker) {
        marker.show();
      });
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
            icon     = '/assets/icons/marker_exclamation.png',
            properties = null;

            var geometry = JSON.parse(story.geometry)
            var feature = new GeoJSON(geometry, config.OVERLAYS_STYLE);

            // place markers
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

    _loadMongabayLayer: function() {
      var that = this;

      $.ajax({
        async: false,
        url: "https://wri-01.cartodb.com/api/v1/sql?q=SELECT * FROM mongabaydb WHERE published >= now() - INTERVAL '3 Months'&format=geojson",
        success: function(data) {
          _.each(data.features, function(features) {
            var position = new google.maps.LatLng(features.properties.lat, features.properties.lon),
                thumb    = features.properties.thumbnail,
                icon     = '/assets/icons/marker_exclamation.png',
                properties = null,
                published = new Date(features.properties.published).toLocaleDateString();

            var feature = new GeoJSON(features.geometry, config.OVERLAYS_STYLE);

            if(feature.length > 0) {
              feature[0].setMap(map);
              that.mongabayFeatures.push(feature[0]);
            }

            var title = features.properties.title;

            if (title.length > 34) {
              title = $.trim(title).substring(0, 34).split(" ").slice(0, -1).join(" ") + "...";
            }

            var content = "<strong><a href='"+ features.properties.loc +"' target='_blank'>" + title + "</a></strong> <span>by " + features.properties.author + " </span><span>on " + published + "</span><br><a href='"+ features.properties.loc +"' target='_blank'>read more</a>";

            marker = new GFWMarker({ position: position, icon: icon, thumbnail_url: thumb, content: content, map: map, type: 'mongabay' });

            that.mongabayMarkers.push(marker);
          });

          var clusterStyles = [
            {
              textColor: '#ffffff',
              url: '/assets/icons/marker_cluster.png',
              width: 36,
              height: 36
            },
           {
              textColor: '#ffffff',
              url: '/assets/icons/marker_cluster.png',
              width: 36,
              height: 36
            },
           {
              textColor: '#ffffff',
              url: '/assets/icons/marker_cluster.png',
              width: 36,
              height: 36
            }
          ];

          var mcOptions = {
            gridSize: 50,
            styles: clusterStyles,
            maxZoom: 15
          };

          that.mc = new MarkerClusterer(map, that.mongabayMarkers, mcOptions);

          that.mongabayLoaded = true;
        }
      });
    },

    _toggleMongabayLayer: function(id) {
      if(this.mongabayLoaded) {
        this.mc.clearMarkers();
        this.mongabayMarkers = [];
        this.mongabayLoaded = false;
      } else {
        this._loadMongabayLayer();
      }

      Filter.toggle(id);
    },

    _hideMongabayLayer: function() {
      if(this.mongabayLoaded) {
        this.mc.clearMarkers();
        this.mongabayMarkers = [];
        this.mongabayLoaded = false;
      }
    },

    _toggleTimeLayer: function() {

      if (this.time_layer && GFW.app.currentBaseLayer !== "semi_monthly") {
        this.time_layer.hide();
        Timeline.hide();
      }

      if(this.time_layer_notplayer &&GFW.app.currentBaseLayer !== "quarterly") {
        this.time_layer_notplayer.hide();
        TimelineNotPlayer.hide();
      }

      if(this.time_layer_imazon &&GFW.app.currentBaseLayer !== "brazilian_amazon") {
        this.time_layer_imazon.hide();
        TimelineImazon.hide();
      }

    },

    _loadTimeLayer: function() {
      var that = this;

      // commented in gmaps library
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
      },2000);

      this.time_layer = new TimePlayer('gfw2_forma', this._global_version, this._cloudfront_url);
      this.time_layer.options.table_name = null;
      map.overlayMapTypes.push(this.time_layer);
      window.time_layer = this.time_layer;

      Timeline.show();
      Timeline.updateCoordinates(that._map.getCenter());

      Timeline.bind('change_date', function(start_month, end_month, year) {
        that.time_layer.set_start_time(start_month);
        that.time_layer.set_time(end_month, year);
      });

      Timeline.loadDefaultRange();
    },

    _loadTimeLayerNotPlayer: function() {
      var that = this;

      this.time_layer_notplayer = new StaticGridLayer({
        map: that._map,
        _table: 'modis_forest_change_copy',
        _global_version: that._global_version,
        _cloudfront_url: that._cloudfront_url
      });

      window.time_layer_notplayer = this.time_layer_notplayer;

      TimelineNotPlayer.show();
      TimelineNotPlayer.updateCoordinates(that._map.getCenter());

      TimelineNotPlayer.bind('change_date', function(month, year) {
        self.time_layer_notplayer.set_time(month, year);
      });

    },

    _loadTimeLayerImazon: function() {
      var that = this;

      this.time_layer_imazon = new StaticGridLayerImazon({
        map: that._map,
        _table: 'imazon_clean',
        _global_version: that._global_version,
        _cloudfront_url: that._cloudfront_url
      });

      window.time_layer_imazon = this.time_layer_imazon;

      TimelineImazon.show();
      TimelineImazon.updateCoordinates(that._map.getCenter());

      TimelineImazon.bind('change_date', function(start_month, end_month, start_year, end_year) {
        self.time_layer_imazon.set_time(start_month, end_month, start_year, end_year);
      });

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

        this.$map_coordinates.hide();

        return;
      } else if (this.currentBaseLayer === "annual") {
        table_name = 'gfw2_hansen';
      } else if (this.currentBaseLayer === "quarterly") {
        if (config.mapLoaded && !this.time_layer_notplayer) {

          this._loadTimeLayerNotPlayer();

        } else {

          if (this.time_layer_notplayer) {
            this.time_layer_notplayer.show();
            TimelineNotPlayer.show();
          }
        }

        this.$map_coordinates.hide();

        return;

      } else if (this.currentBaseLayer === "brazilian_amazon") {
        if (config.mapLoaded && !this.time_layer_imazon) {

          this._loadTimeLayerImazon();

        } else {

          if (this.time_layer_imazon) {
            this.time_layer_imazon.show();
            TimelineImazon.show();
          }
        }

        this.$map_coordinates.hide();

        return;
      } else if (this.currentBaseLayer === "forestgain") {
        return;
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

        if (showMap && wall.readCookie("pass") == 'ok') Filter.show();

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
        hash = "map/" + zoom + "/" + lat + "/" + lng + "/" + config.iso;
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

        this.$map_coordinates = $(".map_coordinates");

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

        if (this.layer.get('slug') == "biome") {
          GFW.app.biomeLayer = this.layer;
        }

        if (this.layer.get('slug') == "nothing") {
          var event = function() {
            GFW.app._hideBiomeLayer(GFW.app.biomeLayer);
            GFW.app.currentBaseLayer = null;
            that._hideBaseLayers(GFW.app);
          };

          Filter.addFilter("", this.layer.get('slug'), this.layer.get('category_name'), this.layer.get('title'), { clickEvent: event, source: null, category_color: this.layer.get("category_color"), color: this.layer.get("title_color") });

        } else if (this.layer.get('slug') == "user_stories") {

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
            legend.toggleItem(this.layer.get('id'), this.layer.get('category_slug'), this.layer.get('category_name'),  this.layer.get('title'), this.layer.get('slug'), this.layer.get('category_color'), this.layer.get('title_color'));
          }
        }
      },

      _bindDisplay: function(display) {
        display.setEngine(this);
      },

      _hideBaseLayers: function(){
        this.$map_coordinates.show();
        this.updateCoordinates(this._map.getCenter());

        GFW.app.currentBaseLayer = null;
        GFW.app._toggleTimeLayer();
        legend.removeCategory("forest_clearing");

        if (GFW.app.baseLayer) GFW.app.baseLayer.setOptions({ opacity: 0 });
      },

      updateCoordinates: function(latLng) {

        var lat = parseFloat(latLng.lat());
        var lng = parseFloat(latLng.lng());

        lat = lat.toFixed(6);
        lng = lng.toFixed(6);

        if (this.$map_coordinates) {
          this.$map_coordinates.html("Lat/Long: "+lat + "," + lng);
        }

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
        semi_monthly  = GFW.app.datalayers.LayersObj.get(569),
        annual        = GFW.app.datalayers.LayersObj.get(568),
        quarterly     = GFW.app.datalayers.LayersObj.get(588),
        sad           = GFW.app.datalayers.LayersObj.get(584);
        fires         = GFW.app.datalayers.LayersObj.get(593);
        forestgain    = GFW.app.datalayers.LayersObj.get(594);

        if (category != 'Forest change' || slug === 'biome') {
          legend.toggleItem(id, category_slug, category, title, slug, category_color, title_color);
        }

        if (slug === 'semi_monthly' || slug === "annual" || slug === "quarterly" || slug === "brazilian_amazon" || slug === "fires" || slug === "forestgain") {

          if (slug === 'semi_monthly' && showMap) {
            Timeline.show();
            analysis.info.model.set("dataset", "forma");
          } else {
            Timeline.hide();
          }

          if (slug === 'quarterly' && showMap) {
            TimelineNotPlayer.show();
            analysis.info.model.set("dataset", "modis");
          } else {
            TimelineNotPlayer.hide();
          }

          if (slug === 'brazilian_amazon' && showMap) {
            TimelineImazon.show();
            analysis.info.model.set("dataset", "imazon");
          } else {
            TimelineImazon.hide();
          }

          GFW.app.currentBaseLayer = slug;
          GFW.app._updateBaseLayer();

          if (slug == 'semi_monthly') {
            semi_monthly.attributes['visible'] = true;
            biome.attributes['disabled'] = false;

            Filter.enableBiome();
          } else if (slug == 'annual') {
            annual.attributes['visible'] = true;
          } else if (slug == 'quarterly') {
            quarterly.attributes['visible'] = true;
          } else if (slug == 'brazilian_amazon') {
            sad.attributes['visible'] = true;
          }

          if (slug == 'forestgain') {
            GFW.app._addLayer(this.layer);
          } else {
            forestgain && GFW.app._removeLayer(forestgain);
          }

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
            if(p.get('slug') === 'user_stories') {
              Filter.addFilter(0, 'nothing', 'People', 'Stay tuned', { disabled: true , category_color: "#707D92", color: "#707D92" });
            }

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
    }
  };
};
