
/**
 * The MapMiniUploadView view.
 *
 * @return MapMiniUploadView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'amplify',
  'turf',
  'mps',
  'core/View',
  'map/services/ShapefileNewService',
  'helpers/geojsonUtilsHelper',
], function(_, Handlebars, amplify, turf, mps, View, ShapefileService, geojsonUtilsHelper) {

  'use strict';

  var MapMiniUploadView = View.extend({

    config: {
      FILE_SIZE_LIMIT: 1000000,
      FILE_SIZE_MESSAGE: 'The selected file is quite large and uploading it might result in browser instability. Do you want to continue?'
    },

    el: '#map-uploading',

    events: {
      'click' : 'onClickUploading',
      'change #input-upload-shape' : 'onChangeFileShape',
      'dragenter' : 'onDragenterShape',
      'dragleave' : 'onDragleaveShape',
      'dragend' : 'onDragendShape',
      'drop' : 'onDropShape'
    },

    initialize: function(map) {
      if (!this.$el.length) {
        return;
      }

      View.prototype.initialize.apply(this);

      this.map = map;
      this.cache();
      this.listeners();
    },

    _subscriptions: [
      // HIGHLIGHT
      {
        'Drawing/toggle': function(toggle){
          this.$inputUploadShape.val('')
        }
      }
    ],

    cache: function() {
      this.$inputUploadShape = this.$el.find('#input-upload-shape');
    },

    listeners: function() {
    },

    /**
     * UI EVENTS
     * - onClickUploading
     * - onChangeFileShape
     * - onDragoverShape
     * - onDragendShape
     * - onDropShape
    */
    onClickUploading: function(e) {
      if (e.target.id === 'map-uploading') {
        this.$inputUploadShape.trigger('click');
      }
    },

    onChangeFileShape: function(e) {
      var file = e.currentTarget.files[0];
      if (file) {
        this.uploadFile(file);
      }
    },

    onDragenterShape: function(e) {
      this.$el.addClass('-moving');
      return false;
    },

    onDragleaveShape: function(e) {
      this.$el.removeClass('-moving');
    },

    onDragendShape: function(e) {
      this.$el.removeClass('-moving');
      return false;
    },

    onDropShape: function(e, data, clone, element) {
      e && e.preventDefault();
      var file = e.originalEvent.dataTransfer.files[0];
      this.uploadFile(file);
      return false;
    },

    /**
     * UPLOAD FILES
     *
     * - uploadFile
     */
    uploadFile: function(file) {
      if (file.size > this.config.FILE_SIZE_LIMIT && !window.confirm(this.config.FILE_SIZE_MESSAGE)) {
        this.$el.removeClass('-moving');
        return;
      }
      mps.publish('Drawing/delete');

      ShapefileService.save(file)
        .then(function(response) {
          var features = response.data.attributes.features;
          if (!!features) {
            var geojson = features.reduce(turf.union),
                bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson),
                geometry = geojson.geometry;

            mps.publish('Drawing/geojson', [geometry]);
            mps.publish('Drawing/bounds', [bounds]);
            mps.publish('Shape/upload', [true]);
          }
        }.bind(this))

        .fail(function(response){
          var errors = response.errors;
          _.each(errors, function(error){
            if (error.detail == 'File not valid') {
              mps.publish('Notification/open', ['notification-file-not-valid'])
            }
          }.bind(this))

        }.bind(this));

      this.$el.removeClass('-moving');
    },

  });

  return MapMiniUploadView;

});
