// Carrousel --------------------------------------

gfw.ui.model.Carrousel = Backbone.Model.extend({

  defaults: {
    hidden: true
  }

});

gfw.ui.view.Carrousel = gfw.core.View.extend({

  className: "carrousel",

  defaults: {
    speed: 300
  },

  events: {

    "click .previous"  : "onPrevious",
    "click .next" : "onNext"

  },

  initialize: function() {

    _.bindAll( this, "onPrevious", "onNext" );

    this.step = 0;

    this.options = _.extend(this.options, this.defaults);

    this.model = new gfw.ui.model.Carrousel();
    this.add_related_model(this.model);

    this.render();

  },

  onNext: function() {
    console.log('right');
    if (this.step < this.sites.length - 4) {
      this.step++;
      //this.$el.find(".inner").animate({ scrollLeft:  239*this.step }, this.defaults.speed);
      //this.$left.fadeIn(250);
    } else {
      //this.$right.fadeOut(250);
    }

  },

  onPrevious: function() {
    console.log('left');
    if (this.step > 0) {
      this.step--;
      //this.$el.find(".inner").animate({ scrollLeft:  239*this.step  }, this.defaults.speed);
      //this.$right.fadeIn(250);
    } else {
      //this.$left.fadeOut(250);
    }

  },

  render: function() {
    var that = this;

    this.$el = $(".carrousel");

    this.$previous = this.$el.find(".previous");
    this.$next     = this.$el.find(".next");

    return this.$el;

  }

});
