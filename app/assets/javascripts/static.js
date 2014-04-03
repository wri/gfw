//= require gfw/ui/carrousel
//= require jquery.qtip.min

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
    'click .nav-item': '_onClickNav',
    'click .source_dropdown_header': '_onClickDropdown',
    'click .source_dropdown_menu a': '_openDropdowns'
  },

  initialize: function() {
    this.model = new gfw.ui.model.Static();

    this.model.bind('change:expanded', this._toggleSource, this);
    this.model.bind('change:selected', this._toggleNav, this);

    this._initCountriesDropdowns();
  },

  _initCountriesDropdowns: function() {
    this.dropdown_logging = $('.source_dropdown_header_logging').qtip({
      show: 'click',
      hide: {
        event: 'click unfocus'
      },
      content: {
        text: $('.source_dropdown_menu_logging')
      },
      position: {
        my: 'top right',
        at: 'bottom right',
        target: $('.source_dropdown_header_logging'),
        adjust: {
          x: -20
        }
      },
      style: {
        tip: {
          corner: 'top right',
          mimic: 'top center',
          border: 1,
          width: 10,
          height: 6
        }
      }
    });

    this.dropdown_mining = $('.source_dropdown_header_mining').qtip({
      show: 'click',
      hide: {
        event: 'click unfocus'
      },
      content: {
        text: $('.source_dropdown_menu_mining')
      },
      position: {
        my: 'top right',
        at: 'bottom right',
        target: $('.source_dropdown_header_mining'),
        adjust: {
          x: -20
        }
      },
      style: {
        tip: {
          corner: 'top right',
          mimic: 'top center',
          border: 1,
          width: 10,
          height: 6
        }
      }
    });

    this.dropdown_oil_palm = $('.source_dropdown_header_oil_palm').qtip({
      show: 'click',
      hide: {
        event: 'click unfocus'
      },
      content: {
        text: $('.source_dropdown_menu_oil_palm')
      },
      position: {
        my: 'top right',
        at: 'bottom right',
        target: $('.source_dropdown_header_oil_palm'),
        adjust: {
          x: -20
        }
      },
      style: {
        tip: {
          corner: 'top right',
          mimic: 'top center',
          border: 1,
          width: 10,
          height: 6
        }
      }
    });

    this.dropdown_wood_fiber_plantations = $('.source_dropdown_header_wood_fiber_plantations').qtip({
      show: 'click',
      hide: {
        event: 'click unfocus'
      },
      content: {
        text: $('.source_dropdown_menu_wood_fiber_plantations')
      },
      position: {
        my: 'top right',
        at: 'bottom right',
        target: $('.source_dropdown_header_wood_fiber_plantations'),
        adjust: {
          x: -20
        }
      },
      style: {
        tip: {
          corner: 'top right',
          mimic: 'top center',
          border: 1,
          width: 10,
          height: 6
        }
      }
    });
  },

  _openDropdowns: function(e) {
    e.preventDefault();

    var dropdown = $(e.target).attr('data-slug'),
        title = $(e.target).text();

    this.dropdown_logging.qtip('api').hide();
    this.dropdown_mining.qtip('api').hide();
    this.dropdown_oil_palm.qtip('api').hide();
    this.dropdown_wood_fiber_plantations.qtip('api').hide();

    if ($('.source_dropdown_body.active').attr('id') === dropdown) return;

    $('.source_dropdown_body.active').removeClass('active').slideUp();
    $('.overview_title:visible span').html(title);
    $('#'+dropdown).addClass('active').slideDown();
  },

  _onClickSource: function(e) {
    e.preventDefault();

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
        selected = $selected.attr('data-slug'),
        href = $selected.attr('href');

    if (selected !== this.model.get('selected')) {
      window.router.navigate(href);

      $('.nav-item.selected').removeClass('selected');
      $selected.addClass('selected');

      ga('send', 'pageview');
      this.model.set('selected', selected);
    }
  },

  _onClickDropdown: function(e) {
    e.preventDefault();
  },

  _goTo: function($el, opt, callback) {
    if ($el) {
      var speed  = (opt && opt.speed)  || 500;
      var delay  = (opt && opt.delay)  || 200;
      var margin = (opt && opt.margin) || 0;

      $('html, body').delay(delay).animate({scrollTop:$el.offset().top - margin}, speed);

      callback && callback();
    }
  },

  _onNavChange: function(tab, accordion) {
    var that = this;

    var $selected = $("[data-slug=" + tab + "]"),
        selected = tab;

    if (selected !== this.model.get('selected')) {
      $('.nav-item.selected').removeClass('selected');
      $selected.addClass('selected');

      this.model.set('selected', selected);

      setTimeout(function() {
        if (!accordion) that._goTo($('#'+selected), { margin: 40 });
      }, 800);
    }

    accordion && this.model.set('expanded', accordion);
  },

  _toggleSource: function() {
    var source = this.model.get('expanded');

    $('.expanded').removeClass('expanded');

    var hash = '';

    if (source) {
      hash = '#'+source;

      $(hash).addClass('expanded');
    }

    window.router.navigate('/sources/'+this.model.get('selected')+hash);
  },

  _toggleNav: function() {
    var selected = this.model.get('selected');

    $('article.selected').fadeOut(250);
    $('article').removeClass('selected');

    $('#'+selected).addClass('selected');
    $('article.selected').fadeIn(250);
  }
});
