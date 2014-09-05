define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'presenters/DialogPresenter',
  'text!templates/dialogs/dialog.handlebars'
], function($, _, Backbone, Handlebars, Presenter, tpl) {

  'use strict';

  var DialogView = Backbone.View.extend({

    className: 'm-dialog',
    template: Handlebars.compile(tpl),

    events: {
      'click #closeBtn': '_remove',
      'click .m-dialog-background': '_remove'
    },

    initialize: function() {
      _.bindAll(this, '_remove');
      this.presenter = new Presenter(this);
      this.$body = $('body');
      $(document).keyup(_.bind(this._onKeyup, this));
    },

    render: function(resource) {
      var $resourceEl, resourceView;

      if(resource.view) {
        resourceView = new resource.view({
          remove: this._remove
        });
        $resourceEl = resourceView.$el;
      } else if (resource.tpl) {
        $resourceEl = $(Handlebars.compile(resource.tpl));
      }

      this.$el.html(this.template());
      this.$el.find('#dialogWrapper').append($resourceEl);
      this.$body.append(this.el);

      // Delegate events views
      this.delegateEvents();

      if (resourceView) {
        resourceView.delegateEvents();
      }
    },

    /**
     * Remove the dialog $el.
     */
    _remove: function() {
      this.$el.remove();
    },

    /**
     * Triggered by a keyup event. Hide the dialog
     * if the user clicks esc.
     *
     * @param  {Object} e Event
     */
    _onKeyup: function(e) {
      if (e.keyCode === 27) {
        this._remove();
      }
    },

  });

  return DialogView;
});
