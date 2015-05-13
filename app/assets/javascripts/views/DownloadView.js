define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'handlebars',
  'text!templates/download.handlebars',
  'text!templates/download_error.handlebars',
], function($,Backbone, _,mps,Handlebars,raw_template,raw_error_template) {

  'use strict';

  var DownloadModel = Backbone.Model.extend({
    sync: function(method, model, options) {
      options || (options = {});
      options.url = '/download';

      Backbone.sync(method, model, options);
    }
  });

  var DownloadView = Backbone.View.extend({
    template: Handlebars.compile(raw_template),
    errorTemplate: Handlebars.compile(raw_error_template),

    el: '.country-download-modal',

    events: {
      'click .close': 'hide',
      'click button': '_requestDownload',
      'click .overlay' : 'hide'
    },

    initialize: function() {
      this.render();
      this.model = new DownloadModel();
    },

    _isMobile: function() {
      return ($(window).width() > 850) ? false : true;
    },

    show: function() {
      this.$el.addClass('active');
    },

    hide: function() {
      this.$el.find('.error').html('');
      this.$el.removeClass('active');
    },

    download: function(event) {
      if (this._isMobile()) {
        event && event.preventDefault() && event.stopPropagation();
        var href = $(event.target).attr('href');
        this.model.set('link', href);
        this.show();
      }
    },

    render: function() {
      if (this._isMobile()) {
        this.$el.html(this.template());
      }
    },

    _requestDownload: function(event) {
      event && event.preventDefault() && event.stopPropagation();

      var email = $('#download_email_form [name="email_address"]').val()
      this.model.set('email', email);

      this.model.save({}, {
        success: _.bind(this._downloadRequestSuccess, this),
        error: _.bind(this._downloadRequestFailure, this)
      });
    },

    _downloadRequestSuccess: function() {
      this.hide();
    },

    _downloadRequestFailure: function() {
      var errorTemplate = this.errorTemplate({
        downloadLink: this.model.get('link')
      });
      this.$el.find('.error').html(errorTemplate);
    }
  });

  return DownloadView;
});
