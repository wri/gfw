'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', '!grunt-template-jasmine-requirejs']
  });
  require('time-grunt')(grunt);

  grunt.initConfig({

    root: {
      app: 'app/assets'
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

    testem: {
      jasmine: {
        src: '<%= root.app %>/javascripts/map/{,*/}{,*/}*.js'
      }
    },

    watch: {
      options: {
        nospawn: true
      },
      scripts: {
        files: '<%= jshint.all %>',
        tasks: ['jshint', 'testem']
      }
    }

  });

  grunt.registerTask('default', [
    'jshint',
    'testem'
  ]);

};
