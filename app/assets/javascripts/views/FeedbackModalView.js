define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'views/ModalView',
  'text!templates/feedbackModal.handlebars'

], function($,Backbone, _, Handlebars, ModalView, tpl) {

  var FeedModalView = ModalView.extend({

    id: '#feedbackModal',

    className: "modal",

    template: Handlebars.compile(tpl),

    events: function() {
      return _.extend({}, ModalView.prototype.events, {
        'click  .js-btn-continue'                  : 'actionContinue',
        'click  .js-btn-submit'                    : 'actionSubmit',
        'click  .js-btn-close'                     : 'actionClose',

        'change .js-radio-box input'               : 'onChange',
      });
    },

    initialize: function() {
      // Inits
      this.constructor.__super__.initialize.apply(this);
      this.render();
      this._initVars();
      this.setListeners();
      this.$body.append(this.el);
    },

    setListeners: function() {
      this.$body.on('click', '.feedback-link', _.bind(this.show, this));
    },

    render: function() {
      this.$el.html(this.template());
      this.cacheVars();
      return this;
    },

    cacheVars: function() {
      this.$modalStep = this.$el.find('.modal-step');
      this.$modalStepBtn = this.$el.find('.modal-step-btn');

      this.$form = this.$el.find('#feedback-form');
      this.$textarea = this.$el.find('#feedback-textarea');
      this.$email = this.$el.find('#feedback-email');
    },

    // Events inside modal
    actionContinue: function(e) {
      this.changeStep(2);
    },

    actionSubmit: function(e) {
      //Check if any input are filled.
      if (!!this.$textarea.val() || !!this.$email.val()) {
        $.ajax({
          url: '/feedback',
          data: this.serializeObject(this.$form.serializeArray()),
          success: _.bind(function() {
            this.changeStep(3);
          }, this )
        })
      }

    },

    actionClose: function(e) {
      this.hide();
    },

    // Changes
    changeRequire: function(e) {
      e && e.preventDefault();
      ($(e.currentTarget).val() === 'true') ? this.$email.attr('required', true) : this.$email.removeAttr('required');
    },

    changeStep: function(step) {
      this.$contentWrapper.animate({scrollTop: 0},0);
      this.$modalStep.removeClass('is-active');
      this.$modalStepBtn.removeClass('is-active');

      // Set actives
      this.$el.find('.modal-step[data-step="'+step+'"]').addClass('is-active');
      this.$el.find('.modal-step-btn[data-step="'+step+'"]').addClass('is-active');
    },

    // Override the default functionality
    hide: function(e) {
      e && e.preventDefault();
      this.model.set('hidden', true);

      //Give back scroll beyond modal window.
      this.$htmlbody.removeClass('is-no-scroll');
      this.changeStep(1);
      return this;
    },

    serializeObject: function(_arr) {
      var o = {};
      var a = _arr;
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
    }



  });

  return FeedModalView;

});
