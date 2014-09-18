//= require jquery/dist/jquery
//= require gfw
//# require gfw/helpers
//= require gfw/ui/widget
//= require gfw/ui/sourcewindow
//= require gfw/ui/carrousel
//= require jquery.qtip.min

$(document).ready(function() {

  var ga = ga || function() {};

  gfw.ui.view.Terms = cdb.core.View.extend({

    el: 'body',

    events: {
      'click .continue'  : '_onClickContinue',
      'click .cancel'    : '_onClickCancel',
      'click .why_terms' : '_onClickWhyTerms'
    },

    initialize: function() {
      this.sourceWindow  = new gfw.ui.view.SourceWindow();
      this.$el.append(this.sourceWindow.render());
    },

    _onClickContinue: function(e) {
      e.preventDefault();

      ga('send', 'event', 'Terms', 'Click', 'I agree');

      var source = $(e.target).closest('.continue').attr('data-source');

      this.sourceWindow.show(source).addScroll();
      this.sourceWindow.$el.find('.close').hide();

      this.sourceWindow.$el.find('.accept_btn').on('click', function() {
        ga('send', 'event', 'Terms', 'Click', 'I agree (Dialog)');
      });

      this.sourceWindow.$el.find('.cancel_btn').on('click', function() {
        ga('send', 'event', 'Terms', 'Click', 'I do not agree (Dialog)');
      });
    },

    _onClickCancel: function(e) {
      e.preventDefault();
      ga('send', 'event', 'Terms', 'Click', 'I do not agree');
    },

    _onClickWhyTerms: function(e) {
      e.preventDefault();
      var source = $(e.target).closest('.why_terms').attr('data-source');
      this.sourceWindow.show(source).addScroll();

      ga('send', 'event', 'Terms', 'Click', 'Why terms (Dialog)');
    }
  });

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

      this.dropdown_wood_people_resource = $('.source_dropdown_header_people_right').qtip({
        show: 'click',
        hide: {
          event: 'click unfocus'
        },
        content: {
          text: $('.source_dropdown_menu_header_people_right')
        },
        position: {
          my: 'top right',
          at: 'bottom right',
          target: $('.source_dropdown_header_people_right'),
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

      this.dropdown_wood_people_land = $('.source_dropdown_header_people_land_right').qtip({
        show: 'click',
        hide: {
          event: 'click unfocus'
        },
        content: {
          text: $('.source_dropdown_menu_header_people_land_right')
        },
        position: {
          my: 'top right',
          at: 'bottom right',
          target: $('.source_dropdown_header_people_land_right'),
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
      this.dropdown_wood_people_resource.qtip('api').hide();
      this.dropdown_wood_people_land.qtip('api').hide();

      if ($('.source_dropdown_body.active').attr('id') === dropdown) return;

      $('.source_dropdown_body.active').removeClass('active');
      $('.overview_title:visible span').html(title);
      $('#'+dropdown).addClass('active');
    },

    _onClickSource: function(e) {
      e.preventDefault();

      var $target = $(e.target).closest('.source-item'),
          source = $target.attr('id');

      if ($target.hasClass('disabled')) return;

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
      if(!tab || tab == 'video') return;

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

  if ($('.is-accept_terms-action').length > 0) {
    cdb.init(function() {
      window.accept_terms = new gfw.ui.view.Terms();
    });
  }

  if ($('.is-howto-action').length > 0) {
    var player1,
        player2;

    function onYouTubeIframeAPIReady() {
      player1 = new YT.Player('player1');
      player2 = new YT.Player('player2');
    }

    $(function() {
      var StaticRouter = Backbone.Router.extend({
        routes: {
          'howto/:section': 'change'
        },

        change: function(tab) {
          window.static_howto._onNavChange(tab);
        }
      });

      cdb.init(function() {
        window.carrousel = new gfw.ui.view.Carrousel({ el: $('.carrousel'), video: true });

        window.static_howto = new gfw.ui.view.Static();

        window.router = new StaticRouter();
        Backbone.history.start({ pushState: true });
      });
    });
  }

  if ($('.is-about-action').length > 0) {
    var StaticRouter = Backbone.Router.extend({
      routes: {
        'about/:section': 'change'
      },

      change: function(tab) {
        window.static_about._onNavChange(tab);
      }
    });

    cdb.init(function() {
      window.static_about = new gfw.ui.view.Static();

      window.router = new StaticRouter();
      Backbone.history.start({ pushState: true });
    });
  }

  if ($('.is-data-action').length > 0) {
    var StaticRouter = Backbone.Router.extend({
      routes: {
        'sources/:section': 'change'
      },

      change: function(tab) {
        var accordion = window.location.hash.replace('#','');

        window.static_data._onNavChange(tab, accordion);
      }
    });

    cdb.init(function() {
      window.static_data = new gfw.ui.view.Static();

      window.router = new StaticRouter();
      Backbone.history.start({ pushState: true });
    });
  }

});


