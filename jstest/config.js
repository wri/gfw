require.config({

  // appDir: '',
  baseUrl: '../app/assets/javascripts',

  paths: {
    amplify: '../../../vendor/assets/bower_components/amplify/lib/amplify',
    underscore: '../../../vendor/assets/bower_components/underscore/underscore',
    backbone: '../../../vendor/assets/bower_components/backbone/backbone',
    jquery: '../../../vendor/assets/bower_components/jquery/dist/jquery',
    d3: '../../../vendor/assets/bower_components/d3/d3',
    topojson: '../../../vendor/assets/bower_components/topojson/topojson',
    cartodb: '../../../vendor/assets/bower_components/cartodb.js/dist/cartodb.full.uncompressed',
    moment: '../../../vendor/assets/bower_components/moment/moment',
    text: '../../../vendor/assets/bower_components/requirejs-text/text',
    mps: '../../../vendor/assets/bower_components/minpubsub/minpubsub',
    _string: '../../../vendor/assets/bower_components/underscore.string/lib/underscore.string',
    jqueryui: '../../../vendor/assets/javascripts/jquery-ui-1.10.4.custom.min',
    markerclusterer: '../../../vendor/assets/bower_components/gmaps-markerclusterer-plus/src/markerclusterer',
    geojsonArea: '../../../vendor/assets/javascripts/geojson-area',
    uri: '../../../vendor/assets/bower_components/uri-templates/uri-templates',
    handlebars: '../../../vendor/assets/bower_components/handlebars/handlebars',
    store: '../../../vendor/assets/javascripts/store',
    Class: '../../../vendor/assets/bower_components/Class.js/Class',

    helpers: '../../../jstest/helpers',
  },

  shim: {
    amplify: {
      deps: ['jquery'],
      exports: 'amplify'
    },
    jquery: {
      exports: '$'
    },
    jqueryui: {
      depts: ['jquery'],
      exports: '$'
    },
    underscore: {
      exports: '_'
    },
    _string: {
      deps: ['underscore'],
      exports: '_string'
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone',
    },
    uri: {
      exports: 'UriTemplate',
    },
    Class: {
      exports: 'Class',
    },
    handlebars: {
      exports: 'Handlebars'
    }
  }
});
