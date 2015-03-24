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
      options.url = model.get('url');

      Backbone.sync(method, model, options);
    }
  });

  var DownloadView = Backbone.View.extend({
    template: Handlebars.compile(raw_template),
    errorTemplate: Handlebars.compile(raw_error_template),

    el: 'body',

    events: {
      'click .download' : 'download',
      'click .close': 'hide',
      'click #download_email_form .submit': '_requestDownload'
    },

    initialize: function() {
      this.model = new DownloadModel();

      this.$wrapper = $('#window');
      this.$content = $('#window .content');

      this.mobile = ($(window).width() > 850) ? false : true;
    },

    show: function() {
      this.render();
      this.$wrapper.addClass('active');
    },

    hide: function() {
      this.$wrapper.removeClass('active');
    },

    download: function(event) {
      if (this.mobile) {
        event && event.preventDefault() && event.stopPropagation();
        this.show();

        var href = $(event.target).attr('href');
        this.model.set('url', href);
      }
    },

    render: function() {
      if (this.mobile) {
        this.$content.html(this.template());
      }
    },

    _downloadRequestSuccess: function() {
      this.hide();
    },

    _downloadRequestFailure: function() {
      var errorTemplate = this.errorTemplate({
        downloadLink: this.model.get('url')
      });
      this.$content.find('.error').html(errorTemplate);
    },

    _requestDownload: function(event) {
      event && event.preventDefault() && event.stopPropagation();

      var email = $('#download_email_form [name="email_address"]').val()
      this.model.set('email', email);

      this.model.save({}, {
        success: _.bind(this._downloadRequestSuccess, this),
        error: _.bind(this._downloadRequestFailure, this)
      });
    }
  });

  return DownloadView;
});
