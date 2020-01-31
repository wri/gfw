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
    defaults: {
      type: 'default'
    },

    sync: function(method, model, options) {
      options || (options = {});
      options.url = '/download';

      Backbone.sync(method, model, options);
    }
  });

  var DownloadView = Backbone.View.extend({
    template: Handlebars.compile(raw_template),
    errorTemplate: Handlebars.compile(raw_error_template),

    el: '.download-modal',

    text:{
      default : {
        title : 'Request a link',
        description : 'Enter your email address to receive a link to download data'
      },
      'country-stats' : {
        title : 'Request a download link',
        description : 'Enter your email to receive a link to download tree cover statistics for this country'
      },
      'forest-change' : {
        title : 'Request a download link',
        description : 'Enter your email to receive a link to download this data for your area of interest'
      }

    },

    events: {
      'click .close': 'hide',
      'click button': '_requestDownload',
      'click .overlay' : 'hide'
    },

    initialize: function() {
      this.model = new DownloadModel();
      this.$loader = $('#mini-modal-loader');
      this.setListeners();
      this.render();
      mps.publish('DownloadView/create',[this]);
    },

    setListeners: function(){
      $('body').on('click', '.download-mobile-link', _.bind(function(event){
        this.download(event);
      }, this ));
    },

    _isMobile: function() {
      return ($(window).width() > 850) ? false : true;
    },

    show: function() {
      this.render();
      this.$el.addClass('active');
    },

    hide: function() {
      this.$el.find('.error').html('');
      this.$el.removeClass('active');
    },

    download: function(event) {
      if (!$(event.currentTarget).hasClass('disabled')) {
        if (isMobile.any && this._isMobile()) {
          event && event.preventDefault() && event.stopPropagation();
          var href = $(event.currentTarget).attr('href');
          var type = $(event.currentTarget).data('type') || 'default';
          this.model.set('link', href);
          this.model.set('type', type);
          this.show();
        }
      } else{
        event && event.preventDefault() && event.stopPropagation();
      }
    },

    render: function() {
      if (this._isMobile()) {
        this.$el.html(this.template({ text: this.text[this.model.get('type')]}));
      }
    },

    _requestDownload: function(event) {
      event && event.preventDefault() && event.stopPropagation();

      var email = $('#download_email_form [name="email"]').val()
      if(this.validateEmail(email)){
        this.$loader.addClass('active');
        this.model.set('email', email);

        this.model.save({}, {
          success: _.bind(this._downloadRequestSuccess, this),
          error: _.bind(this._downloadRequestFailure, this)
        });
      }else{
        mps.publish('Notification/open',['notification-email-incorrect']);
      }
    },

    _downloadRequestSuccess: function() {
      mps.publish('Notification/open',['notification-email-send']);
      this.$loader.removeClass('active');
      this.hide();
    },

    _downloadRequestFailure: function() {
      var errorTemplate = this.errorTemplate({
        downloadLink: this.model.get('link')
      });
      this.$loader.removeClass('active');
      this.$el.find('.error').html(errorTemplate);
    },

    validateEmail: function(email){
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },


  });

  return new DownloadView();
});
