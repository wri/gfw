define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'handlebars',
  'text!templates/download.handlebars',
], function($,Backbone, _,mps,Handlebars,raw_template) {

  'use strict';

  var DownloadModel = Backbone.Model.extend({
    sync: function(method, model, options) {
      debugger
      options || (options = {});
      options.url = model.get('url');

      Backbone.sync(method, model, options);
    }
  });

  var DownloadView = Backbone.View.extend({
    template: Handlebars.compile(raw_template),

    el: 'body',

    events: {
      'click .download' : 'download',
      'click .close': 'hide',
      'submit #download_email_form': '_requestDownload'
    },

    initialize: function(options) {
      this.options = options;

      this.model = this._createModel();

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

    _createModel: function() {
      var iso = this.options.country.get('iso');
      return new DownloadModel({
        url: '/country/' + iso + '/download'
      });
    },

    _requestDownload: function(event) {
      event && event.preventDefault() && event.stopPropagation();

      var email = $('#download_email_form [name="email_address"]').val()
      this.model.set('email', email);
      this.model.save({}, {sucess: function(){}, error: function(){ debugger; }});
    }
  });

  return DownloadView;
});
