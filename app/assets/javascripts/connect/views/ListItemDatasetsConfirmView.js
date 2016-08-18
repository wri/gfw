define([
  'backbone',
  'handlebars',
  'moment',
  'mps',
  'text!connect/templates/listItemDatasetsConfirm.handlebars'
], function(Backbone, Handlebars, moment, mps, tpl) {

  'use strict';

  var ListItemDatasetsConfirmView = Backbone.View.extend({
    events: {
      'click #confirm-delete': 'confirm',
      'click #cancel-delete': 'cancel',
      'click .modal-backdrop': 'cancel',
      'click .modal-close': 'cancel',
      'change .dataset-checkbox' : 'onChangeDataset'
    },

    className: 'my-gfw-subscription-delete-modal',

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      this.model = options.model;
    },

    cache: function() {
      this.$datasetCheckboxs = this.$el.find('.dataset-checkbox');
    },

    render: function() {
      this.$el.html(this.template({
        model: this.model.toJSON()
      }));
      this.cache();

      this.selectDatasets();

      return this;
    },

    selectDatasets: function() {
      _.each(this.$datasetCheckboxs, function(el){
        var isChecked = _.indexOf(this.model.get('datasets'), $(el).attr('id')) != -1;
        $(el).prop('checked', isChecked);
      }.bind(this));
    },

    cancel: function(e) {
      e.preventDefault();
      this.remove();
    },

    confirm: function(e) {
      e.preventDefault();
      if (!!this.model.get('datasets').length) {      
        this.trigger('confirmed', this.model.get('datasets'));
        this.remove();
      } else {
        mps.publish('Notification/open', ['notification-my-gfw-subscription-dataset-required']);
      }
    },

    onChangeDataset: function(e){
      e && e.preventDefault();
      var datasets = _.compact(_.map(this.$datasetCheckboxs, function(el){
        var isChecked = $(el).is(':checked');
        return (isChecked) ? $(el).attr('id') : null;
      }.bind(this)));

      this.model.set('datasets', _.clone(datasets));
    }

  });

  return ListItemDatasetsConfirmView;

});