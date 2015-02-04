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
    UmdOptions = {},
    Timeline = {},
    resizePID;
    // Filter already init

$(function() {
  var Router = Backbone.Router.extend({
    routes: {
      '':                                                             'home',
      '/':                                                            'home',
      'map':                                                          'map',
      'map/':                                                         'map',
      'embed/map':                                                    'map',
      'embed/map/':                                                   'map',
      'map/:zoom/:lat/:lon/:iso':                                     'mapWithCoordinates',
      'map/:zoom/:lat/:lon/:iso/:basemap/:baselayer':                 'mapWithCoordinates',
      'map/:zoom/:lat/:lon/:iso/:basemap/:baselayer/*layers':         'mapWithCoordinates',
      'embed/map/:zoom/:lat/:lon/:iso':                               'mapWithCoordinates',
      'embed/map/:zoom/:lat/:lon/:iso/:basemap/:baselayer':           'mapWithCoordinates',
      'embed/map/:zoom/:lat/:lon/:iso/:basemap/:baselayer/*layers':   'mapWithCoordinates'
    },

    home: function() {
      this.trigger('loadgfw', 'home');
    },

    map: function() {
      this.trigger('loadgfw', 'map');
    },

    mapWithCoordinates: function(zoom, lat, lon, iso, basemap, baselayer, layers) {
      if (zoom) config.MAPOPTIONS.zoom = parseInt(zoom, 10);

      if (lat && lon) {
        config.MAPOPTIONS.center = new google.maps.LatLng(lat, lon);
        map && map.setCenter(config.MAPOPTIONS.center);
      }

      if (iso) config.ISO = iso;

      if (basemap) config.BASEMAP = basemap;

      var baselayers = [
        'loss',
        'loss10',
        'loss15',
        'loss20',
        'loss25',
        'loss30',
        'loss50',
        'loss75',
        'forma',
        'imazon',
        'modis',
        'fires',
        'none'
      ]

      if (baselayer) {
        var baselayer_ = baselayer.split("?")[0];

        if (_.contains(baselayers, baselayer_)) {
          config.BASELAYER = (baselayer === 'none') ? null : baselayer_;
        }
      }

      config.MAPOPTIONS.layers = layers ? _.map((layers.split("?")[0]).split(","), function(i) { return parseInt(i, 10); }) : [];

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
      'click .home.ajax': '_onClickHome',
      'click .map.ajax':  '_onClickMap',
      'click .source':    '_onClickSource'
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

      if ($(e.target).hasClass('all')) {
        if (config.MAPOPTIONS.layers.length >= 1) {
          if (!_.include(config.MAPOPTIONS.layers, 580)) {
            $('.user_stories .checkbox').click();
          } else {
            GFW.app._goTo($('#map'), { margin: '67' })
          }
        } else {
          $('.user_stories .checkbox').click();
          GFW.app._goTo($('#map'), { margin: '67' })
        }
      }

      if ($(e.target).hasClass('analyzing')) {
        Analysis.startAnalyzing();
      }

      updateHash();
    },

    _loadGFW: function(state) {
      var that = this;

      if (!loaded) {
        map = new google.maps.Map(document.getElementById('map'), config.MAPOPTIONS);

        var basemap = config.BASEMAP,
            styledMap = {};

        if (_.contains(['terrain', 'satellite', 'roads'], basemap)) {
          map.setMapTypeId(config.MAPSTYLES[basemap].style);
        } else if (isLandsat(basemap) || _.contains(['grayscale', 'treeheight'], basemap)) {
          if (basemap === 'treeheight') {
            styledMap = config.MAPSTYLES[basemap].style;
          } else {
            styledMap = isLandsat(basemap) || new google.maps.StyledMapType(config.MAPSTYLES[basemap].style, { name: basemap });
          }

          map.mapTypes.set(basemap, styledMap);
          map.setMapTypeId(basemap);
        }

        this.subscribecountry = url('?subscribe');

        google.maps.event.addListenerOnce(map, 'idle', function() {
          that._loadOtherStuff();

          GFW(function(env) {
            GFW.app = new env.app.Instance(map, {
              logging : false
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

      if (!$('body').hasClass('embed')) {
        // Timeline
        Timeline = new gfw.ui.view.Timeline();
        this.$map.append(Timeline.render());

        // Circle
        Circle = new gfw.ui.view.Circle({ circles: circleSummary });
        this.$map.append(Circle.render());
        Circle.show();
      }

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
      Analysis = new gfw.ui.view.Analysis({ subscribecountry: this.subscribecountry });
      this.$map.append(Analysis.render());
      Analysis.info.setDraggable(true);

      // UMD options
      UmdOptions = new gfw.ui.view.UmdOptions({ map: map });
      this.$map.append(UmdOptions.render());

      // Share
      Share = new gfw.ui.view.Share();
      if (!$('body').hasClass('embed')) {
        this.$map.append(Share.render());
      }

      if (config.ISO !== 'ALL') {
        Analysis.loadCountry(config.ISO);
      } else if (url('?geom')) {
        Analysis.disableAnalysisButton();
        Analysis.loadPolygon(JSON.parse(decodeURI(url('?geom'))));
      }

      this._setupListeners();

      Filter.init();

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

      ga('send', 'event', 'Map', 'Info', 'Open ' + source);
      SourceWindow.show(source, coverage).addScroll();
    },

    _selectMenu: function(name) {
      $('.navbar li a').removeClass('selected');
      $('.navbar .'+name).addClass('selected');

      if (name === 'map') {
        $('.header').addClass('stuck');
      } else {
        $('.header').removeClass('stuck');
      }
    },

    _showHomeState: function() {
      var that = this;

      showMap = false;

      Filter.hide(function() {
        $('.header').animate({ height: '230px' }, 250, function() {
          $('.header-title').fadeIn(250);
          $('.for_business').fadeIn(250);
          $('.fires').fadeIn(250);
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
          Share.hide();
          $('#zoom_controls').hide();
          $('#viewfinder').hide();
        });
      }
    },

    _showMapState: function() {
      var that = this;

      showMap = true;

      if (!Analysis.model.get('analyzing')) {
        LayerSelector.show();
        Legend.show();
        SearchBox.show();
        Share.show();
        if (config.BASELAYER && config.BASELAYER.indexOf('loss') === 0) {
          UmdOptions.show();
        }

        if ($('body').hasClass('embed')) {
          Analysis.disableAnalysisButton();
        } else {
          Timeline.show();
          Circle.hide();
        }
      }

      $('#zoom_controls').show();
      $('#viewfinder').show();

      if (config.BASELAYER !== 'fires' && config.BASELAYER !== null) Analysis.show();

      $('.for_business').fadeOut(250);
      $('.fires').fadeOut(250);

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

    _setupListeners: function(){
      var that = this;
      if(that.model.get('state') === 'home'){
        google.maps.event.addListener(map, 'click', function(event) {
          updateHash();
          that.model.set('state', 'map');
          return true;
        });
      } else {
        google.maps.event.clearListeners(map, 'click');
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
