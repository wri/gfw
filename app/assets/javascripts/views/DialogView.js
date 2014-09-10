/**
 * The DialogView removes boilerplate code and adds
 * default behaviors and interactions.
 *
 * You can create a simple dialog modal or complex wizards.
 * It works with the Presenter pattern.
 *
 * To create a dialog just follow this steps:
 *
 *  1. Go to helpers/dialogsHelper. Here is where all our dialogs
 *  are defined. You can append a template or a view (with his own
 *  template) to the dialog. Views are keep under views/dialogs, and
 *  templates under templates/dialogs.
 *
 *  eg.
 *
 *    analysis: {
 *      subscribe: {
 *        view: AnalysisSubscribeDialogView
 *      }
 *    }
 *
 *  2. To call a dialog no you just have to call it with mps.
 *  Params is an object you can pass to those dialogs with
 *  views.
 *
 *     mps.publish('Dialog/new', [{
 *       type: 'analysis',
 *       id: 'subscribe'
 *     }, params]);
 *
 *  --------
 *
 * Wizard feature:
 *
 * You can add steps to your dialog, so instead having to
 * render another one, you can  just call nextStep() or
 * previousStep() to move from differents states.
 *
 * TODOS =>
 *   Add goToStep() method
 *
 */
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
      'click #close': 'remove',
      'click .close-icon': 'remove',
      'click .m-dialog-background': 'remove'
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.$body = $('body');
      $(document).keyup(_.bind(this._onKeyup, this));
    },

    /**
     * Renders the dialog by appending to it the
     * supplied view or template.
     *
     * @param  {Object} resource Resource identificator
     * @param  {Object} params  Modal params
     */
    render: function(resource, params) {
      var $resourceEl, resourceView;

      if(resource.view) {
        resourceView = new resource.view({
          remove: _.bind(this.remove, this),
          nextStep: _.bind(this.nextStep, this),
          previousStep: _.bind(this.previousStep, this)
        }, params);
        $resourceEl = resourceView.$el;
      } else if (resource.tpl) {
        $resourceEl = $(Handlebars.compile(resource.tpl));
      }

      this.$el.html(this.template());
      this.$el.find('#dialogWrapper').append($resourceEl);

      this.$stepsArr = this.$el.find('[data-dialog-step]');

      if (this.$stepsArr.length) {
        this.$stepsArr.slice(1).addClass('is-hidden');
      }

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
    remove: function() {
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
        this.remove();
      }
    },

    nextStep: function() {
      this._moveStep('next');
    },

    previousStep: function() {
      this._moveStep('previous');
    },

    _moveStep: function(direction) {
      this.$stepsArr.each(_.bind(function(i, el) {
        var $el = $(el);

        if (!$el.hasClass('is-hidden')) {
          if (direction === 'next') {
            direction = [i + 1, i + 2];
          } else {
            direction = [i - 1, i];
          }

          this.$stepsArr
            .slice.apply(this.$stepsArr, direction)
            .removeClass('is-hidden')
            .siblings()
            .addClass('is-hidden');
          return false;
        }
      }, this));
    },

  });

  return DialogView;
});
