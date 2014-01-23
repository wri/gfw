gfw.ui.model.Static = cdb.core.Model.extend({
  defaults: {
    expanded: null, // accordion
    selected: 'forest_change' // left_navigation
  }
});


gfw.ui.view.Static = cdb.core.View.extend({

  el: document.body,

  events: {
    'click .source_header': '_onClickSource',
    'click .nav-item': '_onClickNav'
  },

  initialize: function() {
    this.model = new gfw.ui.model.Static();

    this.model.bind('change:expanded', this._toggleSource, this);
    this.model.bind('change:selected', this._toggleNav, this);
  },

  _onClickSource: function(e) {
    var source = $(e.target).closest('.source-item').attr('id');

    if (source === this.model.get('expanded')) {
      this.model.set('expanded', null);
    } else {
      this.model.set('expanded', source);
    }
  },

  _onClickNav: function(e) {
    e.preventDefault();

    var $selected = $(e.target).closest('.nav-item'),
        selected = $selected.attr('data-slug');

    if (selected !== this.model.get('selected')) {
      $('.nav-item.selected').removeClass('selected');
      $selected.addClass('selected');

      this.model.set('selected', selected);
    }
  },

  _toggleSource: function() {
    var source = this.model.get('expanded');

    $('.expanded').removeClass('expanded');

    if (source) {
      $('#'+source).addClass('expanded');
    }
  },

  _toggleNav: function() {
    var selected = this.model.get('selected');

    $('article.selected').fadeOut(250);
    $('article').removeClass('selected');

    $('#'+selected).addClass('selected');
    $('article.selected').fadeIn(250);
  }
});
