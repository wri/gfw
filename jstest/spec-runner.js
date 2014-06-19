require.config({ 

  baseUrl: '..',
  
  paths: {
    jquery: ['vendor/assets/javascripts/jquery'],
    underscore: ['vendor/assets/javascripts/underscore'],
    backbone: ['vendor/assets/javascripts/backbone'],
    mps: ['vendor/assets/javascripts/minpubsub'],
    backbonequeryparams: ['vendor/assets/javascripts/backbone.queryparams'],
    gmap: ['app/assets/javascripts/map/gmap'],
    d3: ['vendor/assets/javascripts/d3'],
    backbone_cartodb: ['vendor/assets/javascripts/backbone.cartodb'],
    cartodb: ['vendor/assets/javascripts/cartodb'],
    store: ['vendor/assets/javascripts/store'],
    text: ['vendor/assets/javascripts/text'],
    Class: ['vendor/assets/javascripts/class'],
    uri: ['vendor/assets/javascripts/uri'],
    app: ['app/assets/javascripts/map/app'],
    nsa: ['app/assets/javascripts/map/nsa'],
    moment: ['vendor/assets/javascripts/moment'],
    analysis: ['app/assets/javascripts/map/analysis'],
    router: ['app/assets/javascripts/map/router'],
    mediator: ['app/assets/javascripts/map/mediator'],
    presenter: ['app/assets/javascripts/map/presenter'],
    views: ['app/assets/javascripts/map/views'],
    models: ['app/assets/javascripts/map/models'],
    collections: ['app/assets/javascripts/map/collections'],
    itertools: ['vendor/assets/javascripts/itertools'],
    
    spec: ['../jstest/spec'],
    helpers: ['../jstest/helpers'],
    jasmine: ['../jstest/lib/jasmine'],
    jasmine_html: ['../jstest/lib/jasmine-html'],
    jasmine_boot: ['../jstest/lib/boot'],
    mock_ajax: ['../jstest/lib/mock-ajax']
  },
  
  shim: {
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
      deps: ['mps', 'Class'],
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

require(
[/*'spec/analysis_spec',*/ 'spec/nsa_spec', 'mock_ajax'], 
function(){
  // NOOP
});