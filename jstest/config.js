require.config({

  // appDir: '',
  baseUrl: '../app/assets/javascripts',

  modules: [
    {
      "name": "map"
    },
    {
      "name": "static"
    },
    {
      "name": "landing"
    },
    {
      "name": "stories"
    },
    {
      "name": "countries"
    }
  ],

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
    chosen: "../../../vendor/assets/bower_components/chosen/chosen.jquery",
    jqueryui: '../../../vendor/assets/javascripts/jquery-ui-1.10.4.custom.min',
    jqueryujs: "../../../vendor/assets/javascripts/jquery-ujs/src/rails",
    markerclusterer: '../../../vendor/assets/bower_components/gmaps-markerclusterer-plus/src/markerclusterer',
    geojsonArea: '../../../vendor/assets/javascripts/geojson-area',
    uri: '../../../vendor/assets/bower_components/uri-templates/uri-templates',
    handlebars: '../../../vendor/assets/bower_components/handlebars/handlebars',
    slick: "../../../vendor/assets/bower_components/slick.js/slick/slick.min",
    simplePagination: "../../../vendor/assets/bower_components/jquery.simplePagination/jquery.simplePagination",
    keymaster: "../../../vendor/assets/bower_components/keymaster/keymaster",
    enquire: "../../../vendor/assets/bower_components/enquire/dist/enquire",
    picker: "../../../vendor/assets/bower_components/pickadate/lib/picker",
    pickadate: "../../../vendor/assets/bower_components/pickadate/lib/picker.date",
    scrollit: "../../../vendor/assets/bower_components/ScrollIt.js/scrollIt",
    qtip: "../../../vendor/assets/bower_components/qtip2/jquery.qtip.min",
    jquery_fileupload: "../../../vendor/assets/bower_components/jquery-file-upload/js/jquery.fileupload",
    jquery_migrate: "../../../vendor/assets/bower_components/jquery-migrate/jquery-migrate",
    geojson: "../../../vendor/assets/bower_components/geojson-google-maps/GeoJSON",
    wax: "../../../vendor/assets/javascripts/wax.g.min",
    store: '../../../vendor/assets/javascripts/store',
    Class: '../../../vendor/assets/bower_components/Class.js/Class',
    jasmine: "../../../vendor/assets/bower_components/jasmine",
    sinon: "../../../vendor/assets/bower_components/sinon/lib/sinon",
    bluebird: "../../../vendor/assets/bower_components/bluebird/js/browser/bluebird",
    helpers: "helpers",
    utils: "map/utils",
    abstract: "abstract",
    templates: "templates",
    views: "views"
  },

  shim: {
    "underscore": {
      "exports": "_"
    },
    "_string": {
      "exports": "_string",
      "deps": [
        "underscore"
      ]
    },
    "amplify": {
      "deps": [
        "jquery"
      ],
      "exports": "amplify"
    },
    "backbone": {
      "deps": [
        "jquery",
        "underscore"
      ],
      "exports": "Backbone"
    },
    "jqueryui": {
      "deps": [
        "jquery"
      ],
      "exports": "$"
    },
    "chosen": {
      "deps": [
        "jquery"
      ],
      "exports": "chosen"
    },
    "pagination": {
      "deps": [
        "jquery"
      ],
      "exports": "simplePagination"
    },
    "Class": {
      "exports": "Class"
    },
    "uri": {
      "exports": "UriTemplate"
    },
    "handlebars": {
      "exports": "Handlebars"
    },
    "picker": {
      "deps": [
        "jquery"
      ]
    },
    "pickadate": {
      "deps": [
        "jquery",
        "picker"
      ],
      "exports": "DatePicker"
    },
    "geojson": {
      "exports": "geojson"
    },
    "jqueryujs": {
      "deps": [
        "jquery"
      ],
      "exports": "jqueryujs"
    },
    "scrollit": {
      "deps": [
        "jquery"
      ],
      "exports": "scrollit"
    },
    "jquery_migrate": {
      "deps": [
        "jquery"
      ],
      "exports": "jquery_migrate"
    },
    "jquery_fileupload": {
      "deps": [
        "jquery"
      ],
      "exports": "jquery_fileupload"
    }
  }
});
