gfw.ui.view.CountriesHeader = cdb.core.View.extend({
  el: '#headerView',

  events: {
    'click #btn-menu' : 'toggleMenu'
  },

  initialize: function() {
    //CACHE
    this.$htmlbody = $('html,body');
    this.$window = $(window);
    this.$navMobile = $('#nav-mobile');
    this.$footer = $('#footerMenu');
    this.$siteMap = $('#siteMap');
    this.$mobileMenu = $('#mobileMenu');
    this.$translate = $('#google_translate_element');

    this.createMenu();
    this.$window.on('resize',_.bind(this.createMenu,this))
  },

  toggleMenu: function(e){
    $(e.currentTarget).toggleClass('active');
    if ($(e.currentTarget).hasClass('active')) {
      this.$htmlbody.addClass('active');
      this.$el.addClass('active');
      this.$navMobile.addClass('active');
    }else{
      this.$htmlbody.removeClass('active');
      this.$el.removeClass('active');
      this.$navMobile.removeClass('active');
    }
  },

  createMenu: function(){
    if (this.$window.width() > 700) {
      this.$footer.appendTo(this.$siteMap);
      this.$translate.appendTo($('#google_translate_element_box1'));
    }else{
      this.$footer.appendTo(this.$mobileMenu);
      this.$translate.appendTo($('#google_translate_element_box2'));
    }
  }


});
