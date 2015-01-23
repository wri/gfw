gfw.ui.model.Carrousel = cdb.core.Model.extend({
  defaults: {
    hidden: true,
    video: false
  }
});

gfw.ui.view.Carrousel = cdb.core.View.extend({
  el: $('#carrousel-stories'),

  defaults: {
    speed: 300
  },

  events: {
    'click .btn-nav' : 'onChange',
  },

  initialize: function() {
    if (!this.$el.length) {
      return
    }
    this.current = 0;
    this.$btnNav = this.$el.find('.btn-nav'); 
    this.$slide = this.$el.find('.slide');
    this.len = this.$slide.length;

    // inits
    this.setCurrent();
  },

  setCurrent: function(){
    this.$slide.removeClass('current');
    this.$slide.eq(this.current).addClass('current');    
  },

  onChange: function(e) {
    e && e.preventDefault();
    var dir = $(e.currentTarget).data('direction')
    switch(dir){
      case 'prev':
        (this.current === 0) ? this.current = this.len - 1 : this.current--;
      break;
      case 'next':
        (this.current === this.len - 1) ? this.current = 0 : this.current++;
      break;
      default:
        this.current = dir
      break;
    }
    this.setCurrent();
  }

});