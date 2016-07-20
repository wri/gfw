define([
  'stories/collections/StoriesCollection',
], function(Stories) {

  'use strict';

  describe('StoriesCollection', function() {

    describe('.setPage', function() {

      beforeEach(function() {
        var storyModels = [];

        var i=1;
        for (; i<=10; i++) {
          storyModels.push({ id: i });
        }

        this.stories = new Stories(storyModels, {perPage: 5});
      });

      describe('given 10 models, with 5 per page', function() {

        var getIDs = function(models) {
          return models.map(function(story) {
            return parseInt(story.get('id'), 10);
          }).sort(function(a,b){return a-b});
        };

        it('defaults to showing the first 5', function() {
          var IDs = getIDs(this.stories.getPaginatedModels());
          expect(IDs).toEqual([1,2,3,4,5]);
        });

        it('limits the models to the correct 5', function() {
          this.stories.setPage(2);
          var IDs = getIDs(this.stories.getPaginatedModels());
          expect(IDs).toEqual([6,7,8,9,10]);
        });

      });

    });

  });

});
