//= require jquery-migrate-1.2.1.min
//= require jquery-ui-1.10.4.custom.min
//= require class
//= require backbone.cartodb
//= require jquery.easing.1.3
//= require jquery.tipsy
//= require imgLiquid.min
//= require wax.g.min
//= require cartodb-gmapsv3
//= require markerclusterer_compiled
//= require gfw/canvas_tile_layer
//= require gfw/deforestation_tile_layer
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
//= require gfw/ui/analysis
//= require gfw/ui/search
//= require gfw/ui/filter
//= require gfw/ui/layer_selector
//= require gfw/ui/timeline
//= require gfw/ui/timeline_loss
//= require gfw/ui/timeline_modis
//= require gfw/ui/timeline_imazon


/*
 *
 *  Home entry point
 *
 */


var loaded = false,
    map = null,
    showMap = false,
    Infowindow = {},
    SourceWindow = {},
    LayerSelector = {},
    Legend = {},
    Analysis = {},
    SearchBox = {},
    Timeline = {},
    TimelineLoss = {},
    TimelineImazon = {},
    TimelineModis = {};
    // Filter and Circle have already been init

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
      // if (iso != 'ALL') analysis._loadCountry(iso);
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

      this.$map = $("#map");

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
          that._loadOtherStuff();

          GFW(function(env) {
            GFW.app = new env.app.Instance(map, {
              user       : 'wri-01',
              layerTable : 'layerinfo_dev_copy',
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
      $('.styled.checkbox').on('click', function(e) {
        e.preventDefault();

        $(this).toggleClass('checked');
        $(this).hasClass('checked') ? $(this).find('input').val(1) : $(this).find('input').val(0);
      });

      // Source window
      SourceWindow = new gfw.ui.view.SourceWindow();
      this.$el.append(SourceWindow.render());

      // Info window
      Infowindow = new CartoDBInfowindow(map, { className: 'story_infowindow', width: 215 });

      // Timeline
      Timeline = new gfw.ui.view.Timeline({ container: this.$map });
      TimelineLoss = new gfw.ui.view.TimelineLoss({ container: this.$map });
      TimelineImazon = new gfw.ui.view.TimelineImazon({ container: this.$map });
      TimelineModis = new gfw.ui.view.TimelineModis({ container: this.$map });

      // Layer selector
      LayerSelector = new gfw.ui.view.LayerSelector({ map: map });
      this.$map.append(LayerSelector);
      LayerSelector.setDraggable(true);

      // Legend
      Legend = new gfw.ui.view.Legend();
      this.$map.append(Legend.render());
      Legend.setDraggable(true);

      // Analysis
      Analysis = new gfw.ui.view.Analysis();
      this.$map.append(Analysis);
      // this.analysis.setDraggable(true);

      // Search box
      SearchBox = new gfw.ui.view.SearchBox({ map: map });
      this.$map.append(SearchBox);
      SearchBox.setDraggable(true);

      SearchBox.bind('goto', function(latlng, bounds) {
        map.setCenter(latlng);
        map.fitBounds(bounds);
      });

      Filter.init();
      // Circle.init()
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
    },

    _showHomeState: function() {
      this._selectMenu('home');

      showMap = false;

      Filter.hide(function() {
        $('.header').animate({ height: '230px' }, 250, function() {
          $('.header-title').animate({ opacity: 1 }, 250);

          $('.big_numbers').fadeIn(250);
        });
      });

      if (GFW && GFW.app) {
        GFW.app.close(function() {
          // Circle.show(250);
        });
      }
    },

    _showMapState: function() {
      var that = this;

      this._selectMenu('map');

      showMap = true;

      LayerSelector.show();
      Legend.show();
      Analysis.show();
      SearchBox.show();
      // Circle.hide();
      // $('#zoom_controls').show();
      // $('#viewfinder').show();

      if(GFW.app.currentBaseLayer && GFW.app.currentBaseLayer === 'forma') {
        Timeline.show();
      } else if(GFW.app.currentBaseLayer && GFW.app.currentBaseLayer === 'modis') {
        TimelineModis.show();
      } else if(GFW.app.currentBaseLayer && GFW.app.currentBaseLayer === 'imazon') {
        TimelineImazon.show();
      } else if(GFW.app.currentBaseLayer && GFW.app.currentBaseLayer === 'loss') {
        TimelineLoss.show();
      }

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
