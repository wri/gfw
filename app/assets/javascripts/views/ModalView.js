define([
  'jquery',
  'backbone',
  'underscore',
], function($,Backbone, _) {

  var ModalModel = Backbone.Model.extend({
    defaults: {
      hidden: true,
    }
  });

  var ModalView = Backbone.View.extend({

    events: {
      'click .modal-backdrop' : 'hide',
      'click .modal-close' : 'hide',
      'click .modal-hide' : 'hide',
    },

    initialize: function() {
      // Model
      this.model = new ModalModel();

      // Init
      this.model.on("change:hidden", this._toggle, this);
    },

    _cache: function() {
      this.$window = $(window);
      this.$document = $(document);
      this.$body = $('body');
      this.$htmlbody = $('html, body');

      this.$content =        this.$el.find('.modal-content');
      this.$contentWrapper = this.$el.find('.modal-wrapper');
      this.$backdrop =       this.$el.find('.modal-backdrop');
      this.$close =          this.$el.find('.modal-close');

      this.mobile = (this.$window.width() > 850) ? false : true;
    },

    _initBindings: function() {
      // document keyup
      this.$document.on('keyup', _.bind(function(e) {
        if (e.keyCode === 27) {
          this.hide();
        }
      },this));
      // backdrop
      this.$backdrop.on('click', _.bind(function() {
        this.hide();
      },this));
    },

    _stopBindings: function() {
      this.$document.off('keyup');
      this.$backdrop.off('click');
    },

    _toggle: function() {
      (!!this.model.get('hidden')) ? this._stopBindings() : this._initBindings();
      this.$el.toggleClass('is-active', !this.model.get('hidden'));
      //Prevent scroll beyond modal window.
      this.$htmlbody.toggleClass('is-no-scroll', !this.model.get('hidden'));
    },

    hide: function(e) {
      e && e.preventDefault();
      this.model.set('hidden', true);

      //Give back scroll beyond modal window.
      this.$htmlbody.removeClass('is-no-scroll');

      return this;
    },

    show: function(e) {
      e && e.preventDefault() && e.stopPropagation();
      this.model.set('hidden', false);
    },

  });

  return ModalView;

});
