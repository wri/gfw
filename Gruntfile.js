'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', '!grunt-template-jasmine-requirejs']
  });
  require('time-grunt')(grunt);

  grunt.initConfig({

    root: {
      app: 'app/assets',
      test: 'jstest'
    },

    connect: {
      server: {
        options: {
          port : 9090
        }
      }
    },

    jasmine: {
      test: {
        options: {
          specs: [
            '<%= root.test %>/spec/*_spec.js',
          ],
          host: 'http://127.0.0.1:9090/',
          helpers: '<%= root.test %>/helpers/*.js',
          outfile: '<%= root.test %>/SpecRunner.html',
          keepRunner: true,
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: '<%= root.test %>/config.js'
          },
          vendor: [
            '<%= root.test %>/lib/mock-ajax.js',
            'http://maps.googleapis.com/maps/api/js?libraries=places,visualization,drawing&sensor=false&key=AIzaSyDJdVhfQhecwp0ngAGzN9zwqak8FaEkSTA'
          ]
        }
      }
    },

    watch: {
      options: {
        spawn: false
      },
      test: {
        files: [
          'Gruntfile.js',
          '<%= root.app %>/javascripts/map/{,*/}{,*/}{,*/}*.js'
        ],
        tasks: ['jasmine']
      }
    }

  });

  grunt.registerTask('test', [
    'connect:server',
    'jasmine'
  ]);

  grunt.registerTask('default', [
    'connect:server',
    'jasmine',
    'watch'
  ]);

};
