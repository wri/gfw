//= require jquery-migrate-1.2.1.min
//= require class
//= require backbone.cartodb
//= require jquery.easing.1.3
//= require jquery.tipsy
//= require gfw/canvas_tile_layer
//= require gfw/gfw_lib
//= require gfw/grid_layer
//= require ui/widget
//= require ui/sourcewindow
//= require ui/infowindow
//= require home/analysis
//= require home/filter
//= require home/circle


/*
 *
 *  Home entry point
 *
 */


var loaded = false,
    map = null;


$(function() {

  var Router = Backbone.Router.extend({

    routes: {
      '':                                   'home',
      '/':                                  'home',
      'map':                                'map',
      'map/':                               'map',
      'map/:zoom/:lat/:lon':                'mapWithCoordinates',
      'map/:zoom/:lat/:lon/:iso':           'mapWithCoordinates',
      'map/:zoom/:lat/:lon/:iso/*layers':   'mapWithCoordinates',
    },

    home: function() {
      this.trigger('loadgfw', 'home');
    },


    map: function() {
      this.trigger('loadgfw', 'map');
    },

    mapWithCoordinates: function(zoom, lat, lon, iso, layers) {
      if (lat && lon) { config.MAPOPTIONS.center = new google.maps.LatLng(lat, lon); }
      if (zoom)       { config.MAPOPTIONS.zoom   = parseInt(zoom, 10); }
      if (layers)     { config.MAPOPTIONS.layers = layers; }

      if (!iso) {
        config.ISO = 'ALL';
      } else {
        config.ISO = iso;
      }

      this.trigger('loadgfw', 'map');

      if (lat && lon) map.setCenter(new google.maps.LatLng(lat, lon));
      if (iso != 'ALL') analysis._loadCountry(iso);
    }
  });

  var AppModel = cdb.core.Model.extend({
    defaults: {
      state: 'home'
    }
  })

  var App = cdb.core.View.extend({

    events: {
      'click .home.ajax':   '_onClickHome',
      'click .map.ajax':    '_onClickMap',
      'click .source':      '_openSource'
    },

    el: document.body,

    initialize: function() {
      this.model = new AppModel();

      this._initRouter();
    },

    _initRouter: function() {
      this.router = window.router;

      this.router.bind('loadgfw', this._loadGFW, this);
    },

    _onClickHome: function(e) {
      e.preventDefault();

      window.router.navigate('', { trigger: true } );
    },

    _onClickMap: function(e) {
      e.preventDefault();

      this._updateHash();
    },

    _loadGFW: function(state) {
      var that = this;

      if (!loaded) {
        map = new google.maps.Map(document.getElementById('map'), config.MAPOPTIONS);

        google.maps.event.addListenerOnce(map, 'idle', function() {
          GFW(function(env) {
            GFW.app = new env.app.Instance(map, {
              user       : 'wri-01',
              // layerTable : 'layerinfo_minus_imazon',
              layerTable : 'layerinfo_minus_imazon_copy',
              logging    : false
            });

            GFW.app.run();

            if (state !== that.model.get('state')) {
              that.model.set('state', state);

              state === 'home' ? that._showHomeState() : that._showMapState();
            }
          });

          that._initListeners();
          that._loadOtherStuff();

          loaded = true;
        });
      } else {
        if (state !== this.model.get('state')) {
          this.model.set('state', state);

          state === 'home' ? this._showHomeState() : this._showMapState();
        }
      }
    },

    _loadOtherStuff: function() {
      this.analysis = new gfw.ui.view.Analysis(map);
      this.storyInfowindow = new CartoDBInfowindow(map, { className: 'story_infowindow', width: 215 });

      this.sourceWindow  = new gfw.ui.view.SourceWindow();

      $('body').append(this.sourceWindow.render());

      $('.styled.checkbox').on('click', function(e) {
        e.preventDefault();

        $(this).toggleClass('checked');
        $(this).hasClass('checked') ? $(this).find('input').val(1) : $(this).find('input').val(0);
      });

      // this.timeline = new gfw.ui.view.Timeline({
      //   container: $('#map')
      // });

      // this.timeline_loss = new gfw.ui.view.TimelineLoss({
      //   container: $('#map')
      // });

      // this.timeline_imazon = new gfw.ui.view.TimelineImazon({
      //   container: $('#map')
      // });

      // this.timeline_modis = new gfw.ui.view.TimelineModis({
      //   container: $('#map')
      // });

      Filter.init();
      Circle.init()
    },

    _openSource: function(e) {
      e.preventDefault();

      var source = $(e.target).attr("data-source");

      this.sourceWindow.show(source).addScroll();
    },

    _initListeners: function() {
      var that = this;

      google.maps.event.addListener(map, 'dragend', function() {
        that._updateHash();
      });

      google.maps.event.addListener(map, 'zoom_changed', function() {
        that._updateHash();
      });

      google.maps.event.addDomListener(map, 'dragend', function(event) {
        that._updateCoordinates();
      });

      google.maps.event.addListener(map, 'center_changed', function(event) {
        that._updateCoordinates();
      });

      google.maps.event.addListener(map, 'zoom_changed', function(event) {
        that._updateCoordinates();
      });
    },

    _updateCoordinates: function() {
      // Timeline.updateCoordinates(that._map.getCenter());
      // TimelineNotPlayer.updateCoordinates(that._map.getCenter());
      // TimelineImazon.updateCoordinates(that._map.getCenter());
    },

    _selectMenu: function(name) {
      $('.navbar li a').removeClass('selected');
      $('.navbar .' + name).addClass('selected');
    },

    _showHomeState: function() {
      this._selectMenu('home');

      Filter.hide(function() {
        $('.header').animate({ height: '230px' }, 250, function() {
          $('.header-title').animate({ opacity: 1 }, 250);

          $('.big_numbers').fadeIn(250);
        });
      });

      if (this.time_layer) {
        this.time_layer.cache_time(true);
        this.time_layer.set_time(128);
      }

      if (GFW && GFW.app) {
        GFW.app.close(function() {
          // Circle.show(250);
        });
      }
    },

    _showMapState: function() {
      this._selectMenu('map');

      // Circle.hide();

      // layerSelector.show();
      // legend.show();
      // analysis.show();
      // searchBox.show();
      // $('#zoom_controls').show();
      // $('#viewfinder').show();

      if (this.time_layer) this.time_layer.set_time(self.time_layer.cache_time());

      // if(GFW.app.currentBaseLayer && GFW.app.currentBaseLayer === 'forma') {
      //   Timeline.show();
      // } else if(GFW.app.currentBaseLayer && GFW.app.currentBaseLayer === 'modis') {
      //   TimelineModis.show();
      // } else if(GFW.app.currentBaseLayer && GFW.app.currentBaseLayer === 'imazon') {
      //   TimelineImazon.show();
      // } else if(GFW.app.currentBaseLayer && GFW.app.currentBaseLayer === 'loss') {
      //   TimelineLoss.show();
      // }

      $('.big_numbers').fadeOut(250);

      $('.header').animate({height: '135px'}, 250, function() {
        if (GFW.app) GFW.app.open();
      });

      $('.header-title').animate({ opacity: 0 }, 250, function() {
        $('header-title').hide();

        Filter.show();

        $('.big_numbers').fadeOut(250);
      });
    },

    _updateHash: function() {
      var hash,
          zoom = map.getZoom(),
          lat = map.getCenter().lat().toFixed(2),
          lng = map.getCenter().lng().toFixed(2);

      var layers = config.MAPOPTIONS.layers;

      if (layers) {
        hash = 'map/' + zoom + '/' + lat + '/' + lng + '/' + config.ISO + '/' + layers;
        window.router.navigate(hash, { trigger: true, replace: true });
      } else {
        hash = 'map/' + zoom + '/' + lat + '/' + lng + '/' + config.ISO;
        window.router.navigate(hash, { trigger: true } );
      }
    }
  });

  cdb.init(function() {
    // Router
    window.router = new Router();

    window.app = new App();

    Backbone.history.start({pushState: true, root: '/'});
  });
});
