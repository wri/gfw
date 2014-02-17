//= require jquery-migrate-1.2.1.min
//= require jquery-ui-1.10.4.custom.min
//= require class
//= require backbone.cartodb
//= require jquery.easing.1.3
//= require jquery.tipsy
//= require jquery.qtip.min
//= require imgLiquid.min
//= require wax.g.min
//= require cartodb-gmapsv3
//= require minpubsub
//= require markerclusterer_compiled
//= require gfw/deforestation_tile_layer
//= require gfw/canvas_tile_layer
//= require gfw/static_grid_layer_imazon
//= require gfw/static_grid_layer
//= require gfw/gfw_lib
//= require gfw/grid_layer
//= require gfw/marker
//= require gfw/ui/widget
//= require gfw/ui/sourcewindow
//= require gfw/ui/infowindow
//= require gfw/ui/protected-infowindow
//= require gfw/ui/legend
//= require gfw/ui/search
//= require gfw/ui/filter
//= require gfw/ui/circle
//= require gfw/ui/layer_selector
//= require gfw/ui/timeline
//= require gfw/ui/timeline/timeline_loss
//= require gfw/ui/timeline/timeline_modis
//= require gfw/ui/timeline/timeline_forma
//= require gfw/ui/timeline/timeline_imazon
//= require gfw/ui/analysis
//= require gfw/ui/analysis/analysis_loss


_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  evaluate: /\[(.+?)\]/g
};


/*
 *
 *  Home entry point
 *
 */


var loaded = false,
    map = null,
    showMap = false,
    SourceWindow = {},
    LayerSelector = {},
    Legend = {},
    Analysis = {},
    SearchBox = {},
    Timeline = {},
    resizePID;
    // Filter and Circle already init

$(function() {
  var Router = Backbone.Router.extend({
    routes: {
      '':                                   'home',
      '/':                                  'home',
      'map':                                'map',
      'map/':                               'map',
      'map/:zoom/:lat/:lon':                'mapWithCoordinates',
      'map/:zoom/:lat/:lon/':               'mapWithCoordinates',
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

        if (lat && lon) map.setCenter(new google.maps.LatLng(lat, lon));
      } else {
        config.ISO = iso;
      }

      this.trigger('loadgfw', 'map');
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
      'click .source':      '_onClickSource'
    },

    el: document.body,

    initialize: function() {
      this.model = new AppModel();

      this.$map = $('#map');
      this.$header = $('.header')

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

      if($(e.target).hasClass('all')) {
        if (!_.include(config.MAPOPTIONS.layers.split(','), '581')) {
          $('.user_stories .checkbox').click();
        }
      }

      if($(e.target).hasClass('analyzing')) {
        Analysis.startAnalyzing();
      }

      this._updateHash();
    },

    _loadGFW: function(state) {
      var that = this;

      if (!loaded) {
        map = new google.maps.Map(document.getElementById('map'), config.MAPOPTIONS);

        var styledMap = new google.maps.StyledMapType(config.BASE_MAP_STYLE, { name: 'terrain_style' });
        map.mapTypes.set('terrain_style', styledMap);
        map.setMapTypeId('terrain_style');

        this.subscribe = window.location.hash.replace('#','') === 'subscribe';

        if (this.subscribe) config.BASELAYER = 'forma';

        google.maps.event.addListenerOnce(map, 'idle', function() {
          that._loadOtherStuff();

          GFW(function(env) {
            GFW.app = new env.app.Instance(map, {
              logging    : false
            });

            GFW.app.run();

            if (state !== that.model.get('state')) {
              that.model.set('state', state);

              state === 'home' ? that._showHomeState() : that._showMapState();
            }
          });

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
      // Source window
      SourceWindow = new gfw.ui.view.SourceWindow();
      this.$el.append(SourceWindow.render());

      // Timeline
      Timeline = new gfw.ui.view.Timeline();
      this.$map.append(Timeline.render());

      // Layer selector
      LayerSelector = new gfw.ui.view.LayerSelector({ map: map });
      this.$map.append(LayerSelector.render());
      LayerSelector.setDraggable(true);

      // Legend
      Legend = new gfw.ui.view.Legend();
      this.$map.append(Legend.render());
      Legend.setDraggable(true);

      // Search box
      SearchBox = new gfw.ui.view.SearchBox({ map: map });
      this.$map.append(SearchBox.render());
      SearchBox.setDraggable(true);

      SearchBox.bind('goto', function(latlng, bounds) {
        map.setCenter(latlng);
        map.fitBounds(bounds);
      });

      // Analysis
      Analysis = new gfw.ui.view.Analysis({ subscribe: this.subscribe });
      this.$map.append(Analysis.render());
      Analysis.info.setDraggable(true);

      if (config.ISO != 'ALL') Analysis.loadCountry(config.ISO);

      Filter.init();
      Circle.init();
      Circle.show();

      $(window).resize(function() {
        clearTimeout(resizePID);
        resizePID = setTimeout(function() { resizeWindow(); }, 100);
      });

      $(window).scroll(positionScroll);
    },

    _onClickSource: function(e) {
      e.preventDefault();

      var source = $(e.target).attr('data-source'),
          coverage = $(e.target).hasClass('coverage');

      SourceWindow.show(source, coverage).addScroll();;
    },

    _selectMenu: function(name) {
      $('.navbar li a').removeClass('selected');
      $('.navbar .' + name).addClass('selected');

      if (name === 'map') {
        $('.header').addClass('stuck');
      } else {
        $('.header').removeClass('stuck');
      }
    },

    _showHomeState: function() {
      showMap = false;

      var that = this;

      Filter.hide(function() {
        $('.header').animate({ height: '230px' }, 250, function() {
          $('.header-title').fadeIn(250);

          $('.for_business').fadeIn(250);

          positionScroll();
        });

        that._selectMenu('home');
      });

      if (GFW && GFW.app) {
        GFW.app.close(function() {
          Circle.show();
          LayerSelector.hide();
          Legend.hide();
          SearchBox.hide();
          Timeline.hide();
          Analysis.hide();
          $('#zoom_controls').hide();
          $('#viewfinder').hide();
        });
      }
    },

    _showMapState: function() {
      var that = this;

      showMap = true;

      Circle.hide();

      if (!Analysis.model.get('analyzing')) {
        LayerSelector.show();
        Legend.show();
        SearchBox.show();
        Timeline.show();
      }

      $('#zoom_controls').show();
      $('#viewfinder').show();
      Analysis.show();

      $('.for_business').fadeOut(250);

      $('.header-title').fadeOut(250, function() {
        $('.header').animate({ height: '135px' }, 250, function() {
          if (GFW.app) GFW.app.open();

          $('.header-title').fadeOut(250, function() {
            $('header-title').hide();

            Filter.show();

            positionScroll();

            that._selectMenu('map');
          });
        });
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
        window.router.navigate(hash, { trigger: true });
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
