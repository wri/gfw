require.config({

  baseUrl: './',

  paths: {
    jquery: '../vendor/assets/bower_components/jquery/src/jquery',
    underscore: '../vendor/assets/bower_components/underscore/underscore',
    backbone: '../vendor/assets/bower_components/backbone/backbone',
    d3: '../vendor/assets/bower_components/d3/d3',
    cartodb: '../vendor/assets/bower_components/cartodb/dist/cartodb',
    text: '../vendor/assets/bower_components/requirejs-text/text',
    moment: '../vendor/assets/bower_components/moment/moment',
    mps: '../vendor/assets/bower_components/minpubsub/minpubsub',

    main: '../app/assets/javascripts/map/main',
    wax: '../vendor/assets/javascripts/wax.g.min',
    jqueryui: '../vendor/assets/javascripts/jquery-ui-1.10.4.custom.min',
    backbonequeryparams: '../vendor/assets/javascripts/backbone.queryparams',
    gmap: '../app/assets/javascripts/map/gmap',
    backbone_cartodb: '../vendor/assets/javascripts/backbone.cartodb',
    cartodblayer: '../vendor/assets/javascripts/cartodb.gmapsv3',
    store: '../vendor/assets/javascripts/store',
    Class: '../vendor/assets/javascripts/class',
    uri: '../vendor/assets/javascripts/uri',
    app: '../app/assets/javascripts/map/app',
    utils: '../app/assets/javascripts/map/utils',
    nsa: '../app/assets/javascripts/map/nsa',
    analysis: '../app/assets/javascripts/map/analysis',
    router: '../app/assets/javascripts/map/router',
    mediator: '../app/assets/javascripts/map/mediator',
    presenter: '../app/assets/javascripts/map/presenter',
    views: '../app/assets/javascripts/map/views',
    templates: '../app/assets/javascripts/map/templates',
    services: '../app/assets/javascripts/map/services',
    presenters: '../app/assets/javascripts/map/presenters',
    models: '../app/assets/javascripts/map/models',
    collections: '../app/assets/javascripts/map/collections',
    itertools: '../vendor/assets/javascripts/itertools',

    spec: 'spec',
    helpers: 'helpers',
    jasmine: 'lib/jasmine',
    jasmine_html: 'lib/jasmine-html',
    jasmine_boot: 'lib/boot',
    mock_ajax: 'lib/mock-ajax'
  },

  shim: {
    jqueryui: {
      deps: ['jquery'],
      exports: 'jqueryui'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone',
    },
    backbone_cartodb: {
      deps: ['underscore', 'backbone'],
      exports: 'backbone_cartodb'
    },
    backbonequeryparams: {
      deps: ['backbone', 'underscore'],
      exports: 'backbonequeryparams'
    },
    uri: {
      exports: 'UriTemplate',
    },
    Class: {
      exports: 'Class',
    },
    app: {
      deps: ['mps', 'Class', 'router'],
      exports: 'app'
    },
    user: {
      deps: ['Class']
    },
    mps: {
      deps: ['jquery', 'underscore'],
      exports: 'mps',
      init: function(foo) {
        var mps = {
          subscribe: window.subscribe,
          unsubscribe: window.unsubscribe,
          publish: window.publish
        };
        return mps;
      }
    }
  }
});

require([
  'mock_ajax',
  //'main',
  'spec/nsa_spec',
  // 'spec/AnalysisService_spec',
  // 'spec/AnalysisButtonPresenter_spec',
  // 'spec/MapLayerService_spec',
  // 'spec/MapPresenter_spec',
  // 'spec/UMDLossLayerPresenter_spec',
  // 'spec/PlaceService_spec'
], function (mock_ajax, main, nsa_spec){
  console.log('Setting up specs...');
});
