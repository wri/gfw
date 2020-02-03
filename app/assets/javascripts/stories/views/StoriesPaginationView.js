define([
  'jquery', 'backbone', 'underscore', 'mps',
], function(
  $, Backbone, _, mps
) {

  var StoriesItemView = Backbone.View.extend({

    initialize: function(options) {
      this.stories = options.stories;
      this.render();
    },

    render: function() {
      this.$el.pagination({
        items: this.stories.length,
        itemsOnPage: 5,
        currentPage: this.stories.page,
        displayedPages: 3,
        edges: 1,
        selectOnClick: false,
        prevText: '<svg><use xlink:href="#shape-arrow-left"></use></svg>',
        nextText: '<svg><use xlink:href="#shape-arrow-right"></use></svg>',
        onPageClick: this.onPageChange.bind(this)
      });

      return this;
    },

    onPageChange: function(pageNumber, event) {
      event.preventDefault();
      this.scrollToTop();
      this.$el.pagination('drawPage', pageNumber);
      this.stories.setPage(pageNumber);
      this.trigger('change');

      mps.publish('SourceStatic/Silentupdate',
        [{section: 'crowdsourced-stories', page: pageNumber}]);
    },

    scrollToTop: function() {
      if ($(window).width() >= 850 ) {
        var $sideBar = $('#storiesResetPosition');
        $('html, body').animate({scrollTop: $sideBar.offset().top}, 500);
      } else {
        $('#sources-box').animate({scrollTop: 0}, 500);
      }
    }

  });

  return StoriesItemView;

});
