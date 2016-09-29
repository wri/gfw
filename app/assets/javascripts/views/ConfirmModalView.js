define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'views/ModalView',
  'presenters/ConfirmModalPresenter',
  'text!templates/confirmModal.handlebars',

], function($,Backbone, _, Handlebars, ModalView, ConfirmModalPresenter, tpl) {

  var ConfirmModel = Backbone.Model.extend({
    defaults: {
      download_link: null
    }
  });

  var ConfirmModalView = ModalView.extend({

    id: '#confirmModal',

    className: "modal is-mini",

    template: Handlebars.compile(tpl),

    initialize: function() {
      // Inits
      this.constructor.__super__.initialize.apply(this);
      this.presenter = new ConfirmModalPresenter(this);
      this.confirmModel = new ConfirmModel(this);
      this.render();
      this._cache();
      this.setListeners();
      this.$body.append(this.el);
    },

    setListeners: function() {
      this.confirmModel.on('change:download_link', this.render.bind(this))
      this.$body.on('click', '.source-confirm', this.sourceClick.bind(this));
    },

    render: function() {
      this.$el.html(this.template(this.confirmModel.toJSON()));
      return this;
    },

    // Fetch model when click
    sourceClick: function(e) {
      e && e.preventDefault() && e.stopPropagation();
      // current
      this.$current = $(e.currentTarget);
      this.confirmModel.set('download_link', this.$current.attr('href'));
      this.show();
    },

  });

  return ConfirmModalView;

});
