/**
 * The MapView class for the Google Map.
 *
 * @return MapView class (extends Backbone.View)
 */

define([
  'backbone',
  'underscore',
  'mps',
  'map/presenters/MapPresenter',
  'map/views/maptypes/grayscaleMaptype',
  'map/views/maptypes/treeheightMaptype',
  'map/views/maptypes/darkMaptype',
  'map/views/maptypes/positronMaptype',
  'map/views/maptypes/landsatMaptype',
  'map/helpers/layersHelper'
], function(Backbone, _, mps, Presenter, grayscaleMaptype, treeheightMaptype, darkMaptype, positronMaptype, landsatMaptype, layersHelper) {

  'use strict';

  var MapView = Backbone.View.extend({

    el: '#map',

    /**
     * Google Map Options.
     */
    options: {
      minZoom: 3,
      backgroundColor: '#99b3cc',
      disableDefaultUI: true,
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      overviewMapControl: false
    },

    /**
     * Constructs a new MapView and its presenter.
     */
    initialize: function() {
      this.presenter = new Presenter(this);
      this.layerInst = {};
      this.$maplngLng = $('.map-container .map-latlng');
      this.$viewFinder = $('#viewfinder');
      this.$overlayMobile = $('#overlay-mobile');
      this.embed = $('body').hasClass('is-embed-action');

      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.render(3);
          this.presenter._resizeSetLayers();
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.render(2);
          this.presenter._resizeSetLayers();
        },this)
      });


    },

    /**
     * Creates the Google Maps and attaches it to the DOM.
     */
    render: function(zoom) {
      var params = {
        zoom: zoom,
        minZoom: zoom,
        mapTypeId: 'grayscale',
        center: new google.maps.LatLng(15, 27),
      };

      this.map = new google.maps.Map(this.el, _.extend({}, this.options, params));

      this._checkDialogs();

      this.resize();
      this._setMaptypes();
      this._addListeners();
      // Node
      this.createMaptypeNode();

    },

    /**
     * Wires up Google Maps API listeners so that the view can respond to user
     * events fired by the UI.
     */
    _addListeners: function() {
      google.maps.event.addListener(this.map, 'zoom_changed',
        _.bind(function() {
          this.onCenterChange();
        }, this)
      );
      google.maps.event.addListener(this.map, 'bounds_changed', _.bind(function() {
        if(!this.center_moved){
          this.offsetCenter(this.map.getCenter(), 0, 270/2);
          this.center_moved = true; 
        }
      }, this ));
      google.maps.event.addListener(this.map, 'dragend',
        _.bind(function() {
          this.onCenterChange();
      }, this));

      google.maps.event.addListenerOnce(this.map, 'idle', _.bind(function() {
        this.$el.addClass('is-loaded');
      }, this));

      google.maps.event.addListener(this.map, 'click', _.bind(function(wdpa) {
        if (!(!!wdpa.wdpaid)) {
          return;
        }
        // TODO => No mps here!
        mps.publish('AnalysisTool/analyze-wdpaid', [wdpa]);
      }, this));

      google.maps.event.addListener(this.map, 'maptypeid_changed', _.bind(function() {
        this.setCredit('Map tiles by <a href="http://cartodb.com/attributions#basemaps">CartoDB</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.');
      }, this ));


      this.$overlayMobile.on('click', _.bind(function(){
        this.presenter.closeDialogsMobile();
      }, this ));

    },


    /**
     * Set map options from the suplied options object.
     *
     * @param {Object} options
     */
    setOptions: function(options) {
      this.map.setOptions(options);
      this.onCenterChange();
      this.presenter.onMaptypeChange(options.mapTypeId);
    },

    /**
     * Add passed layers to the map and remove the rest.
     *
     * @param {object} layers  Layers object
     * @param {object} options Layers options from url
     */
    setLayers: function(layers, options) {
      _.each(this.layerInst, function(inst, layerSlug) {
        !layers[layerSlug] && this._removeLayer(layerSlug);
      }, this);

      layers = _.sortBy(_.values(layers), 'position');
      this._addLayers(layers, options);
    },

    /**
     * Add layers to the map one by one, waiting until the layer before
     * is already rendered. This way we can get the layer order right.
     *
     * @param {array}   layers  layers array
     * @param {object}  options layers options eg: threshold, currentDate
     * @param {integer} i       current layer index
     */
    _addLayers: function(layers, options, i) {
      i = i || 0;
      var layer = layers[i];

      var _addNext = _.bind(function() {
        i++;
        layers[i] && this._addLayers(layers, options, i);
      }, this);

      if (layer && !!layersHelper[layer.slug]) {
        if ((!layersHelper[layer.slug].view || this.layerInst[layer.slug])) {
          _addNext();
          return;
        }
        var layerView = this.layerInst[layer.slug] =
          new layersHelper[layer.slug].view(layer, options, this.map);

        layerView.addLayer(layer.position, _addNext);
      }

    },

    /**
     * Get layer position. If layer.position doesn't exist,
     * position is 0 (at the bottom), else it calculates the right position.
     *
     * @param  {object} layer
     * @return {integer} position
     */
    _getOverlayPosition: function(layer) {
      var position = 0;
      var layersCount = this.map.overlayMapTypes.getLength();
      if (typeof layer.position !== 'undefined' && layer.position <= layersCount) {
        position = layersCount - layer.position;
      }
      return position;
    },

    /**
     * Used by MapPresenter to remove a layer by layerSlug.
     *
     * @param  {string} layerSlug The layerSlug of the layer to remove
     */
    _removeLayer: function(layerSlug) {
      var inst = this.layerInst[layerSlug];
      if (!inst) {return;}
      inst.removeLayer();
      inst.presenter && inst.presenter.unsubscribe && inst.presenter.unsubscribe();
      this.layerInst[layerSlug] = null;
    },

    updateLayer: function(layerSlug) {
      var options = {};
      var layer = this.layerInst[layerSlug];
      options.currentDate = layer.currentDate ? layer.currentDate : null;
      options.threshold = layer.threshold ? layer.threshold : null;
      this._removeLayer(layerSlug);
      this._addLayers([layer.layer], options);
    },



    /**
     * Used by MapPresenter to set the map center.
     *
     * @param {Number} lat The center latitude
     * @param {Number} lng The center longitude
     */
    setCenter: function(lat, lng) {
      this.map.setCenter(new google.maps.LatLng(lat, lng));
    },

    getCenter: function() {
      var center = this.map.getCenter();

      return {lat: center.lat(), lng: center.lng()};
    },

    fitBounds: function(bounds) {
      this.center_moved = false;
      this.map.fitBounds(bounds);
    },


    offsetCenter: function(latlng,offsetx,offsety) {

      // latlng is the apparent centre-point
      // offsetx is the distance you want that point to move to the right, in pixels
      // offsety is the distance you want that point to move upwards, in pixels
      // offset can be negative
      // offsetx and offsety are both optional

      var scale = Math.pow(2, this.map.getZoom());
      var nw = new google.maps.LatLng(
          this.map.getBounds().getNorthEast().lat(),
          this.map.getBounds().getSouthWest().lng()
      );

      var worldCoordinateCenter = this.map.getProjection().fromLatLngToPoint(latlng);
      var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)

      var worldCoordinateNewCenter = new google.maps.Point(
          worldCoordinateCenter.x - pixelOffset.x,
          worldCoordinateCenter.y + pixelOffset.y
      );

      var newCenter = this.map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

      this.map.setCenter(newCenter);

    },





    /**
     * Used by Embed to fit bounds.
     */
    myFitBounds: function(myMap, bounds) {
      myMap.fitBounds(bounds);
      var self = this;
      var overlayHelper = new google.maps.OverlayView();
      overlayHelper.draw = function () {
          if (!this.ready) {
              var zoom = self.getExtraZoom(this.getProjection(), bounds, myMap.getBounds(),self);
              if (zoom > 0) {
                  myMap.setZoom(myMap.getZoom() + zoom);
              }
              this.ready = true;
              google.maps.event.trigger(this, 'ready');
          }
      };
      overlayHelper.setMap(myMap);
    },

    // LatLngBounds b1, b2 -> zoom increment
    getExtraZoom: function(projection, expectedBounds, actualBounds,self) {
      var expectedSize = self.getSizeInPixels(projection, expectedBounds),
          actualSize = self.getSizeInPixels(projection, actualBounds);

      if (Math.floor(expectedSize.x) == 0 || Math.floor(expectedSize.y) == 0) {
          return 0;
      }

      var qx = actualSize.x / expectedSize.x;
      var qy = actualSize.y / expectedSize.y;
      var min = Math.min(qx, qy);

      if (min < 1) {
        return 0;
      }

      return Math.floor(Math.log(min) / Math.log(2) /* = log2(min) */);
    },

    // LatLngBounds bnds -> height and width as a Point
    getSizeInPixels: function(projection, bounds) {
      var sw = projection.fromLatLngToContainerPixel(bounds.getSouthWest());
      var ne = projection.fromLatLngToContainerPixel(bounds.getNorthEast());
      return new google.maps.Point( Math.round(10000 * Math.abs(sw.y - ne.y)) / 10000, Math.round(10000 * Math.abs(sw.x - ne.x)) / 10000 );
    },



    /**
     * Used by MapPresenter to set the map type.
     *
     * @param {string} maptype The map type id.
     */
    setMapTypeId: function(maptype) {
      this.map.setMapTypeId(maptype);
      if (maptype === 'terrain') {
        var styles = [
          {
            featureType: 'water',
            stylers: [{
              hue: '#B3E2FF'
            }]
          }
        ];
        this.map.setOptions({styles: styles});
      }
      this.presenter.onMaptypeChange(maptype);
    },

    getMapTypeId: function() {
      return this.map.getMapTypeId();
    },

    createMaptypeNode: function(){
      this.creditNode = document.createElement('div');
      this.creditNode.id = 'credit-control';
      this.creditNode.index = 0;
      this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(this.creditNode);
    },

    setCredit: function(credit){
      var maptype = this.getMapTypeId();
      if (maptype == 'dark' || maptype == 'positron') {
        this.creditNode.style.display = 'block';
        this.creditNode.innerHTML = credit + ' -';
      }else{
        this.creditNode.style.display = 'none';
        this.creditNode.innerHTML = '';
      }
    },





    /**
     * Handles a map center change UI event by dispatching to MapPresenter.
     */
    onCenterChange: function() {
      var center = this.map.getCenter();
      var lat = center.lat();
      var lng = center.lng();
      this.presenter.onCenterChange(lat, lng);
      this.updateLatlngInfo(lat,lng);
      this.checkBounds()
    },

    checkBounds: function () {
      if (! !!this.map.getBounds()) return;

      var latNorth = this.map.getBounds().getNorthEast().lat();
      var latSouth = this.map.getBounds().getSouthWest().lat();
      var newLat;

      if(latNorth<85 && latSouth>-85)     /* in both side -> it's ok */
        return;
      else {
        if(latNorth>85 && latSouth<-85)   /* out both side -> it's ok */
          return;
        else {
            if(latNorth>85)
              newLat =  this.map.getCenter().lat() - (latNorth-85);   /* too north, centering */
            if(latSouth<-85)
              newLat =  this.map.getCenter().lat() - (latSouth+85);   /* too south, centering */
        }
      }
      if(newLat) {
        var newCenter= new google.maps.LatLng( newLat ,this.map.getCenter().lng() );
        this.map.setCenter(newCenter);
      }
    },

    /**
     * Resizes the map.
     */
    resize: function() {
      google.maps.event.trigger(this.map, 'resize');
      this.map.setZoom(this.map.getZoom());
      this.map.setCenter(this.map.getCenter());
    },

    /**
     * Set additional maptypes to this.map.
     */
    _setMaptypes: function() {
      this.map.mapTypes.set('grayscale', grayscaleMaptype());
      this.map.mapTypes.set('treeheight', treeheightMaptype());
      this.map.mapTypes.set('dark', darkMaptype());
      this.map.mapTypes.set('positron', positronMaptype());
      for (var i = 1999; i < 2013; i++) {
        this.map.mapTypes.set('landsat{0}'.format(i), landsatMaptype([i]));
      }
    },


    /**
     * Crosshairs when analysis is activated
     */
    crosshairs: function(){
      this.$viewFinder.addClass('hidden');
      this.$maplngLng.removeClass('hidden');
      this.$analysislatlng = $('#analysisLatlng');

      this.$el.on('mousemove', _.bind(this.updatePositionCrosshairs, this ))
    },

    updatePositionCrosshairs: function(event){
      var currentBounds = this.map.getBounds();
      var topLeftLatLng = new google.maps.LatLng( currentBounds.getNorthEast().lat(), currentBounds.getSouthWest().lng());
      var point = this.map.getProjection().fromLatLngToPoint( topLeftLatLng );
      point.x += event.offsetX / ( 1<<this.map.getZoom() );
      point.y += event.offsetY / ( 1<<this.map.getZoom() );

      var latlong = this.map.getProjection().fromPointToLatLng( point );
      this.updateLatlngAnalysis(latlong.lat(), latlong.lng());

    },
    /**
     * Updates
     */
    updateLatlngAnalysis: function(lat, lng) {
      var html = 'Lat/long: {0}, {1}'.format(lat.toFixed(6), lng.toFixed(6));
      this.$analysislatlng.html(html);
    },

    centerPositionCrosshairs: function(){
      this.$viewFinder.removeClass('hidden');
      this.$maplngLng.addClass('hidden');
      this.$el.off('mousemove');
      this.onCenterChange();
    },


    /**
     * Updates
     */
    updateLatlngInfo: function(lat, lng) {
      var html = 'Lat/long: {0}, {1}'.format(lat.toFixed(6), lng.toFixed(6));
      this.$maplngLng.html(html);
    },


    /**
    * Display a dialog from the Landing Index First Steps options
    */
    _checkDialogs: function() {
      $(document).ready(function(type){
        if (!sessionStorage.getItem('DIALOG')) return;
        var dialog = JSON.parse(sessionStorage.getItem('DIALOG'));

        if (!dialog.display) return;

        var $container = $('.map-container').find('.widget')[0],
            $trigger   = $( "<a data-source='" + dialog.type +"' class='source hidden hide' style='display: none'></a>" )
        $trigger.appendTo($container).trigger('click');
        sessionStorage.removeItem('DIALOG');
        window.setTimeout(function(){$('.backdrop').css('opacity', '0.3');},500);
      });
    },

    overlayToggle: function(bool){
      this.$overlayMobile.toggleClass('active', bool);
    },

    autolocate: function(){
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          if(navigator.geolocation) {
            $('#map-control-locate .handler').addClass('spinner start');
            navigator.geolocation.getCurrentPosition(
              _.bind(function(position) {
                var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                this.map.setCenter(pos);
                this.map.setZoom(16);
                $('#map-control-locate .handler').removeClass('spinner start');
              }, this ),
              _.bind(function() {
                this.presenter.notificate('notif-enable-location');
                $('#map-control-locate .handler').removeClass('spinner start');
              }, this )
            );
          }
        },this)
      });

    }


  });

  return MapView;

});
