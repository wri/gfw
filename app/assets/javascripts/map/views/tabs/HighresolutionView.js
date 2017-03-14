/**
 * The BasemapsView selector view.
 *
 * @return BasemapsView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'moment',
  'mps',
  'cookie',
  'picker',
  'pickadate',
  'map/presenters/tabs/HighresolutionPresenter',
  'text!map/templates/tabs/highresolution.handlebars'
], function(_, Handlebars, enquire, moment, mps, Cookies, picker, pickadate, Presenter, tpl) {

  'use strict';

  var HighresolutionView = Backbone.View.extend({

    el: '#hd-tab',

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template({}));
    }
  });

  return HighresolutionView;

});
