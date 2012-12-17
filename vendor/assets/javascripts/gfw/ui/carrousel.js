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

    this.step = 1;

    this.options = _.extend(this.options, this.defaults);

    this.model = new gfw.ui.model.Carrousel();
    this.add_related_model(this.model);

    this.render();

  },

  onNext: function() {

    this.$carrousel.find("li:nth-child(" + this.step + ")").fadeOut(this.defaults.speed);
    (this.step >= this.$images.length) ?  this.step = 1 : this.step++;
    this.$carrousel.find("li:nth-child(" + this.step + ")").fadeIn(this.defaults.speed);
  },

  onPrevious: function() {

    this.$carrousel.find("li:nth-child(" + this.step + ")").fadeOut(this.defaults.speed);
    (this.step == 1) ? this.step = this.$images.length : this.step--;
    this.$carrousel.find("li:nth-child(" + this.step + ")").fadeIn(this.defaults.speed);

  },

  render: function() {
    var that = this;

    this.$el = $(".carrousel");

    this.$previous = this.$el.find(".previous");
    this.$next     = this.$el.find(".next");

    this.$carrousel = this.$el.find("ul");
    this.$images    = this.$el.find("li");

    this.$carrousel.find("li:nth-child(1)").fadeIn(this.defaults.speed);

    return this.$el;

  }

});
