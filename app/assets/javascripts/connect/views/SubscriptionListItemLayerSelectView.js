define([
   'backbone', 'chosen', 'handlebars',
   'text!connect/templates/subscriptionListItemLayerSelect.handlebars'
], function(
  Backbone, chosen, Handlebars,
  tpl
) {

  'use strict';

  var SubscriptionListItemLayerSelectView = Backbone.View.extend({

    tagName: 'span',

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      options = options || {};

      this.subscription = options.subscription;
    },

    render: function() {
      this.$el.html(this.template());

      $('body').on('click', this.handleBodyClick.bind(this));

      this.subscription.get('layers').forEach(function(layerName) {
        this.$('option[value="'+layerName+'"]').prop('selected', true);
      }.bind(this));

      this.$('.datasets').chosen({
        disable_search_threshold: 10,
        placeholder_text_multiple: 'Choose a layer',
        no_results_text: 'Oops, nothing found!',
        inherit_select_classes: true,
        width: '400px'
      });

      return this;
    },

    handleBodyClick: function(event) {
      var $el = $(event.target);
      if ($el.parents().length > 0 && $el.parents('.metadata li').length == 0) {
        this.stopEditing();
      }
    },

    stopEditing: function() {
      var layers = this.$('.datasets').val();
      this.subscription.set('layers', layers);
      this.subscription.save('layers', layers, {patch: true}).then(function() {
        this.trigger('complete');
      }.bind(this));
    }

  });

  return SubscriptionListItemLayerSelectView;

});
