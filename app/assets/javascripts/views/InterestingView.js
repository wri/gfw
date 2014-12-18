/**
 * The Interesting view.
 */
define([
  'jquery',
  'backbone',
  'handlebars',
  'mps',
  'text!templates/interesting.handlebars',
], function($,Backbone,Handlebars,mps,tpl) {

  'use strict';

  var interestingHelper = {
    stories_on_the_map: {
      title: 'Stories on the map',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: 'http://0.0.0.0:5000/map/3/15.00/27.00/ALL/grayscale/loss,forestgain/580'
    },
    mongabay_stories: {
      title: 'MONGABAY STORIES',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: 'http://0.0.0.0:5000/map/3/15.00/27.00/ALL/grayscale/loss,forestgain/586'
    },
    ejn_stories: {
      title: 'EJN STORIES',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: '#'
    },
    explore_the_map: {
      title: 'GFW Interactive Map',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: '/map'
    },
    develop_your_own_app: {
      title: 'Develop your own app',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: '/getinvolved/develop-your-own-app'
    },
    submit_a_story: {
      title: 'Submit a story',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: '/getinvolved/submit-a-story'
    },
    download_the_data: {
      title: 'Download the data',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: 'http://data.gfw.opendata.arcgis.com/'
    },
    get_involved: {
      title: 'Get Involved',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: '/getinvolved'
    },
    keep_updated: {
      title: 'Keep Updated',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: '/keepupdated'
    },
    fires_howto: {
      title: 'Fires how to',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: '#'
    },
    commodities_howto: {
      title: 'Commodities how to',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: '#'
    },
    coming_soon: {
      title: 'Coming soon',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.',
      link: '/keepupdated/coming-soon'
    },

  }


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
      var interesting = (_interesting) ? _interesting.split(',') : ['explore_the_map','get_involved','keep_updated'];
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

