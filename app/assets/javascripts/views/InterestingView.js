/**
 * The Interesting view.
 */
define([
  'jquery',
  'backbone',
  'handlebars',
  'mps',
  'helpers/interestingHelper',
  'text!templates/interesting.handlebars',
], function($,Backbone,Handlebars,mps,interestingHelper,tpl) {

  'use strict';


  var InterestingModel = Backbone.Model.extend({
    defaults:{
      interesting: null
    }
  });

  var InterestingView = Backbone.View.extend({

    el: '#interestingView',

    template: Handlebars.compile(tpl),

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      //helper
      this.helper = interestingHelper;
      this.model = new InterestingModel();

      //init
      this.setListeners();
    },

    setListeners: function(){
      mps.subscribe('Interesting/update',_.bind(this.getBoxes,this));
      this.model.on('change', this.render, this);
    },

    getBoxes: function(_interesting){
      var interesting = (_interesting) ? _interesting.split(',') : ['explore_the_map','get_involved','stay_informed'];
      this.arr = _.map(interesting, _.bind(function(box){
        return this.helper[$.trim(box)];
      }, this));
      this.model.set('interesting',this.arr);
    },

    render: function(){
      this.$el.html(this.template(this.model.attributes));
    }

  });

  return InterestingView;

});

