/**
 * The Stories view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'handlebars',
  'text!landing/templates/stories.handlebars'
], function($, Backbone, _, mps, Handlebars, tpl) {

  'use strict';

  var StoriesModel = Backbone.Model.extend({
    defaults:{
      stories: null
    }
  });



  var StoriesView = Backbone.View.extend({

    el: '#storiesView',

    template: Handlebars.compile(tpl),

    initialize: function() {
      //Init Var
      this.url = 'https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20cartodb_id,title,media,ST_AsGeoJSON(the_geom)%20AS%20the_geom%20FROM%20community_stories%20WHERE%20visible=true%20order%20by%20created_at%20desc%20LIMIT%203';
      mps.publish('Spinner:start');
      this.model = new StoriesModel();

      //Init Fn
      this.model.on('change',this.render,this);
      this._loadStories();
    },

    render: function(){
      this.$el.html(this.template(this.model.attributes));
    },

    _loadStories: function(){
      $.ajax({
        url: this.url,
        success: _.bind(function(data) {
          data = data.rows;
          var dataTemplate = _.map(data,_.bind(function (story) {
            story.title = story.title.replace(/^(.{40}[^\s]*).*/, "$1...");
            story.media = jQuery.parseJSON(story.media);
            story.the_geom = jQuery.parseJSON(story.the_geom);
            story.img = story.media[story.media.length -1].preview_url;
            story.url = (story.img) ? 'http://gfw2stories.s3.amazonaws.com/uploads/' + story.img : 'http://maps.google.com/maps/api/staticmap?center=' + story.the_geom.coordinates[1].toFixed(3) + ',' + story.the_geom.coordinates[0].toFixed(3) + '&zoom=4&size=266x266&maptype=terrain&sensor=false';
            return story;
          },this));

          this.model.set('stories',dataTemplate);
          mps.publish('Spinner:stop');

        },this),
        error: function(status, error) {
          mps.publish('Spinner:stop');
        }
      });
    }
  });
  return StoriesView;

});
