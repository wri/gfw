/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'mps',
  'jqueryui',
  'jquery_migrate', 
  'jquery_fileupload',
  'geojson',
  'views/HeaderView',
  'views/FooterView',
  'stories/views/StoriesEditView',
  'handlebars',
  '_string',
], function($, _, Class, Backbone, mps, jqueryui, jquery_migrate, jquery_fileupload, geojson, HeaderView, FooterView, StoriesEditView, Handlebars) {
  'use strict';

  var StoriesPage = Class.extend({

    $el: $('body'),

    init: function() {
      this._initViews();
    },

    /**
     * Initialize Landing Views.
     */
    _initViews: function() {
      //shared
      new HeaderView();
      new FooterView();
      new StoriesEditView();
    }
  });

  new StoriesPage();

});






// require jquery/dist/jquery
// require jquery-migrate-1.2.1.min
// require jquery-ui-1.10.4.custom.min
// require load-image.min
// require jquery.iframe-transport
// require jquery.fileupload
// require jquery.fileupload-process
// require jquery.fileupload-image
// require jquery_ujs
// require geojson

// require gfw
// require gfw/helpers
// require gfw/ui/carrousel


// $(document).ready(function() {

//   if ($('.is-show-action').length > 0) {
//     window.carrousel = new gfw.ui.view.Carrousel();
//   }
//   if ($('.is-new-action').length > 0 || $('.is-edit-action').length > 0) {
//     window.stories_edit = new gfw.ui.view.StoriesEdit();
//   }
// });
