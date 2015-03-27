/**
 * The SharePreviewView view.
 *
 * @return SharePreviewView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'text!templates/share_iframe.handlebars'
], function(_, Handlebars, tpl) {

  'use strict';

  var SharePreviewView = Backbone.View.extend({
    className: 'source_window active iframe',

    template: Handlebars.compile(tpl),

    events: {
      'click .close' : 'hide',
    },

    initialize: function(options) {
      this.src = options.src;
    },

    hide: function(e) {
      e && e.preventDefault();
      this.$el.remove();
    },

    render: function(){
      var renderedTemplate = this.template({src: this.src});
      this.$el.html(renderedTemplate);

      return this;
    }
  });

  return SharePreviewView;

});
