/**
 * The Header view.
 */
define(['jquery', 'backbone', 'underscore', 'mps', 'views/ShareView'], (
  $,
  Backbone,
  _,
  mps,
  ShareView
) => {
  const HeaderView = Backbone.View.extend({
    el: '#headerView',

    events: {
      'click #btn-menu': 'toggleMenu',
      'click #btnAppsMenu': 'toggleAppMenu',
      'click .share-link': 'shareOpen',
      'click .menu-section-link': 'menuOpen'
    },

    initialize() {
      // CACHE
      this.$htmlbody = $('html,body');
      this.$window = $(window);
      this.$document = $(document);
      this.$navMobile = $('#nav-mobile');
      this.$footer = $('#footerMenu');
      this.$mobileMenu = $('#mobileMenu');
      this.$appsMenu = $('#appsSubmenu');
      this.$btnAppsMenu = $('#btnAppsMenu');
      this.$translate = $('#google_translate_element');

      this.mobile = !(this.$window.width() > 850);

      this.createMenu();
      this.$window.on('resize', _.bind(this.createMenu, this));
      this.welcome();
    },

    toggleMenu(e) {
      $(e.currentTarget).toggleClass('active');
      if ($(e.currentTarget).hasClass('active')) {
        this.scrollTop = this.$document.scrollTop();
        this.$htmlbody.addClass('active');
        this.$el.addClass('active');
        this.$navMobile.addClass('active');
      } else {
        this.$htmlbody
          .removeClass('active')
          .animate({ scrollTop: this.scrollTop }, 0);
        this.$el.removeClass('active');
        this.$navMobile.removeClass('active');
      }
    },

    toggleAppMenu(e) {
      if (this.mobile) {
        e && e.preventDefault();
        $(e.currentTarget).toggleClass('active');
        if ($(e.currentTarget).hasClass('active')) {
          this.scrollTop = this.$document.scrollTop();
          this.$htmlbody.addClass('active');
          this.$appsMenu.addClass('active');
          this.$btnAppsMenu
            .find('.shape-apps')
            .children('.icon')
            .toggle();
        } else {
          this.$htmlbody
            .removeClass('active')
            .animate({ scrollTop: this.scrollTop }, 0);
          this.$appsMenu.removeClass('active');
          this.$btnAppsMenu
            .find('.shape-apps')
            .children('.icon')
            .toggle();
        }
      }
    },

    createMenu() {
      if (this.$window.width() > 850) {
        this.mobile = false;
        this.$translate.appendTo($('#google_translate_element_box1'));
      } else {
        this.mobile = true;
        this.$footer.appendTo(this.$mobileMenu);
        this.$translate.appendTo($('#google_translate_element_box2'));
      }
    },

    shareOpen(event) {
      const shareView = new ShareView().share(event);
      this.$el.append(shareView.el);
    },

    menuOpen(e) {
      $(e.currentTarget).toggleClass('active');
      $('#menu-section-dropdown').toggleClass('active');
    },

    welcome() {
      if (window.location.hostname === 'localhost') {
        return;
      }

      console.info(
        '%c .',
        "background-image: url('http://www.globalforestwatch.org/assets/logo-new.png'); width: 85px; height: 90px; float:left;font-size:82px; color: transparent;"
      );
      console.info(
        '%cWelcome to GFW ',
        'background: rgba(151, 189, 61, 0.1); color: #666; padding: 3px 6px;font-size: 15px;'
      );
      console.info(
        "%cIn case you're interested in the code of this website ",
        'background: rgba(151, 189, 61, 0.1); color: #666; padding: 3px 6px;'
      );
      console.info(
        '%cplease, feel free to check our apps: ',
        'background: rgba(151, 189, 61, 0.1); color: #666; padding: 3px 6px;'
      );
      console.info(
        '%chttp://www.globalforestwatch.org/explore/applications ',
        'background: rgba(151, 189, 61, 0.1); font-weight: bold; padding: 3px 6px;'
      );
      console.info(
        '%cor go and fork this project on GitHub: ',
        'background: rgba(151, 189, 61, 0.1); color: #666; padding: 3px 6px;'
      );
      console.info(
        '%chttps://github.com/Vizzuality/gfw ',
        'background: rgba(151, 189, 61, 0.1); font-weight: bold; padding: 3px 6px;'
      );
      console.info(
        '%cand the API: ',
        'background: rgba(151, 189, 61, 0.1); color: #666; padding: 3px 6px;'
      );
      console.info(
        '%chttps://github.com/wri/gfw-api ',
        'background: rgba(151, 189, 61, 0.1); font-weight: bold; padding: 3px 6px;'
      );
      console.info(
        '%cThank you! ',
        'background: rgba(151, 189, 61, 0.1); color: #666; padding: 3px 6px;'
      );
    }
  });

  return HeaderView;
});
