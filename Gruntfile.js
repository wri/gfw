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
      test : {
        port : 8000
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= root.app %>/javascripts/map/{,*/}{,*/}*.js'
      ]
    },

    jasmine: {
      test: {
        options: {
          specs: '<%= root.test %>/spec/*_spec.js',
          host: 'http://127.0.0.1:8000/',
          helpers: '<%= root.test %>/helpers/*.js',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: '<%= root.test %>/config.js'
          },
          vendor: [
            '<%= root.test %>/lib/mock-ajax.js'
          ]
        }
      }
    },

    watch: {
      options: {
        nospawn: true
      },
      scripts: {
        files: '<%= jshint.all %>',
        tasks: ['jshint', 'test']
      }
    }

  });

  grunt.registerTask('test', [
    'connect:test',
    'jasmine'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test'
  ]);

};
