/**
 * The Google Maps module.
 *
 * @return object used to async initialize Google Maps API
 */
define([
  'require',
  'jquery',
  'underscore',
  'handlebars'
], function (require, $, _, Handlebars) {

  'use strict';

  var libs = [
    {
      name: 'maps',
      version: '3',
      options: { other_params: 'libraries=places,drawing&sensor=false' }
    },
    {
      name: 'visualization',
      version: '1',
      options: { packages: ['corechart'] }
    }
  ];

  return {

    /**
     * Loads the Google Maps API and then the CartoDB API. Fires the callback
     * after both are loaded.
     *
     * @param cb The callback function.
     */
    init: function (cb) {

      // After each lib is loaded, get the cartodb lib.
      var done = _.after(libs.length, function () {
        // CARTODB Hack
        cdb.core.Template.compilers = _.extend(cdb.core.Template.compilers, {
          handlebars: typeof(Handlebars) === 'undefined' ? null : Handlebars.compile
        });
        cb();
      });
      // var done = _.after(libs.length, function () {
      //   require(['http://libs.cartocdn.com/cartodb.js/v3/cartodb.js'], function() {
      //     // CARTODB Hack
      //     cdb.core.Template.compilers = _.extend(cdb.core.Template.compilers, {
      //       handlebars: typeof(Handlebars) === 'undefined' ? null : Handlebars.compile
      //     });
      //     cb();
      //   });
      // });

      // Load the jsapi and then grab each lib.
      _.each(libs, function (lib) {
        console.log(google);
        google.load(lib.name, lib.version,
                  _.extend(lib.options, { callback: done }));
        google.maps.visualRefresh = true;
      });
      // require(['https://www.google.com/jsapi?callback=?' +
      //   '&key=AIzaSyDJdVhfQhecwp0ngAGzN9zwqak8FaEkSTA'], function () {
      //   _.each(libs, function (lib) {
      //     google.load(lib.name, lib.version,
      //               _.extend(lib.options, { callback: done }));
      //     google.maps.visualRefresh = true;
      //   });
      // });

    }
  };
});
