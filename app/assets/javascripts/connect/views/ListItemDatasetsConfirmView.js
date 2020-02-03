define([
  'backbone',
  'handlebars',
  'moment',
  'mps',
  'helpers/datasetsHelper',
  'map/services/CoverageService',
  'text!connect/templates/listItemDatasetsConfirm.handlebars'
], function(Backbone, Handlebars, moment, mps, datasetsHelper, CoverageService, tpl) {

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

    render: function() {
      var params = this.model.attributes.params;
      params = _.extend({}, params, params.iso);
      var paramsValues = _.pick(params, 'use', 'useid', 'wdpaid',
      'geostore', 'country', 'region');

      var values = _.compact(_.values(paramsValues));

      if (values.length) {
        this.$el.html(this.template({
          datasets: []
        }));

        CoverageService.get(params)
          .then(function(layers) {
            this.$el.html(this.template({
              datasets: datasetsHelper.getFilteredList(layers, this.model.attributes.datasets)
            }));
          }.bind(this))

          .error(function(error) {
            console.log(error);
          }.bind(this));
      } else {
        this.renderDatasetsList();
      }

      return this;
    },

    renderDatasetsList: function() {
      var selected = this.model.attributes.datasets || [];
      var datasetsList = datasetsHelper.getListSelected(selected);

      this.$el.html(this.template({
        datasets: datasetsList
      }));
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
      var $datasetCheckboxs = this.$el.find('.dataset-checkbox');

      var datasets = _.compact(_.map($datasetCheckboxs, function(el) {
        var isChecked = $(el).is(':checked');
        return (isChecked) ? $(el).attr('id') : null;
      }.bind(this)));

      this.model.set('datasets', _.clone(datasets));
    }

  });

  return ListItemDatasetsConfirmView;

});
