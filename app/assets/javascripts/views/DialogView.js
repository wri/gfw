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

    events: function() {
      // Events outside the context el
      $(document).keyup(_.bind(this._onKeyup, this));

      return {
        'click #closeBtn': '_remove',
        'click .m-dialog-background': '_remove'
      };
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.$body = $('body');
    },

    render: function(resourceTpl) {
      resourceTpl = Handlebars.compile(resourceTpl);

      this.$el.html(this.template({
        resourceTpl: resourceTpl
      }));

      this.delegateEvents();
      this.$body.append(this.el);
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
