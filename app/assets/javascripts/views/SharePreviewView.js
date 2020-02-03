/**
 * The SharePreviewView view.
 *
 * @return SharePreviewView instance (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'handlebars',
  'text!templates/share_iframe.handlebars'
], function(Backbone, _, Handlebars, tpl) {

  'use strict';

  var SharePreviewView = Backbone.View.extend({
    className: 'source_window active iframe',

    template: Handlebars.compile(tpl),

    events: {
      'click .close' : 'hide',
    },

    initialize: function(options) {
      this.src = options.src;
      this.width = options.width || 600;
      this.height = options.height || 600;
    },

    hide: function(e) {
      e && e.preventDefault();
      this.remove();
    },

    render: function(){
      var renderedTemplate = this.template({
        src: this.src,
        width: this.width,
        height: this.height,
      });
      this.$el.html(renderedTemplate);

      return this;
    }
  });

  return SharePreviewView;

});
