/**
 * The ThresholdView selector view.
 *
 * @return ThresholdView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/tabs/ThresholdPresenter',
  'text!map/templates/tabs/threshold.handlebars'
], function(_, Handlebars, Presenter, tpl) {

  'use strict';


  var ThresholdModel = Backbone.Model.extend({
    hidden: true
  });


  var ThresholdView = Backbone.View.extend({

    el: '#threshold-tab',

    template: Handlebars.compile(tpl),

    events: {
      // slider
      'change #range-threshold': 'updateThreshold',
      'input #range-threshold': 'setVisibleRange',
      // labels
      'click #labels-threshold li' : 'clickLabel'
    },

    valuesMap: [10,15,20,25,30,50,75],

    initialize: function(parent) {
      this.parent = parent;
      this.model = new ThresholdModel();
      this.presenter = new Presenter(this);
      this.render();
      this.setListeners();
      //Experiment
      this.presenter.initExperiment('source');
      this.presenter._setVisibility();
    },

    cacheVars: function(){
      this.$button = $('#'+this.$el.attr('id')+'-button');
      this.$range = $('#range-threshold');
      this.$labels = $('#labels-threshold').find('li');
      this.$progress = $('#progress-threshold');
    },

    setListeners: function(){
    },

    render: function(){
      this.$el.html(this.template({values: this.valuesMap }));
      this.cacheVars();
    },

    // input range change
    updateThreshold: function() {
      var value = this.$range.val();
      this.setVisibleRange(value);
      this.presenter.setThreshold(this.valuesMap[value]);
      (this.valuesMap[value] !== 30) ? this.$button.addClass('changed') : this.$button.removeClass('changed');

      ga('send', 'event', 'Map', 'Settings', 'Threshold: ' + this.valuesMap[value]);
    },

    setVisibleRange: function(){
      var width = (100/(this.valuesMap.length - 1)) * this.$range.val();
      this.$progress.width(width + '%')
    },

    // click on label
    clickLabel: function(e){
      this.$range.val($(e.currentTarget).data('slider-value'));
      this.updateThreshold();
    },

    // update Presenter
    updatePresenter: function(value){
      this.$range.val(this.valuesMap.indexOf(value));
      this.updateThreshold();
    },

    // disable on-off
    toggleVisibility: function(bool){
      var value = this.$range.val();
      if (bool) {
        (this.$button.hasClass('active')) ? this.$button.trigger('click') : null;
        this.$button.removeClass('changed').addClass('disabled');
      }else{
        this.$button.removeClass('disabled');
        (this.valuesMap[value] !== 30) ? this.$button.addClass('changed') : this.$button.removeClass('changed');
      }
    }



  });
  return ThresholdView;

});
