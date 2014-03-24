gfw.ui.model.Circle = cdb.core.Model.extend();

gfw.ui.collection.Circles = Backbone.Collection.extend({
  model: gfw.ui.model.Circle
});


gfw.ui.view.Circle = cdb.core.View.extend({
  className: 'circle',

  events: {
    "click":      "_onClick",
    "mouseenter": "_onMouseEnter",
    "mouseleave": "_onMouseLeave"
  },

  defaults: {
    init: false
  },

  initialize: function() {
    var that = this;

    this.options = _.extend(this.options, this.defaults);

    this.circles = new gfw.ui.collection.Circles();

    _.each(this.options.circles, function(circle) {
      that.circles.add(new gfw.ui.model.Circle({ icon: circle.icon, count: circle.count, title: circle.title }));
    });

    this.currentCircle = this.circles.first();

    this.animating = true;
    this.animatingB = false

    var template = $('#circle-template').html();

    this.template = new cdb.core.Template({
      template: template
    });
  },

  _onClick: function(e) {
    e && e.preventDefault();

    window.router.navigate("map", { trigger: true });
  },

  _onMouseEnter: function() {
    clearInterval(this.circlePID);

    if (this.animating) return;

    var that = this;

    $(this.$circle).find(".circle-title, .circle-counter").stop().animate({ opacity: 0 }, 100, "easeInExpo", function() {
      $(that.$circle).find(".circle-explore, .circle-background").stop().animate({ opacity: 1 }, 100, "easeOutExpo");
      $(that.$icon).stop().animate({ backgroundSize: "10%", opacity: 0 }, 200, "easeInExpo");
    });
  },

  _onMouseLeave: function() {
    clearInterval(this.circlePID);

    this.circlePID = this._startAnimation();

    if (this.animating) return;

    var that = this;

    $(this.$circle).find(".circle-explore, .circle-background").stop().animate({ opacity: 0 }, 100, "easeOutExpo", function() {
      $(that.$title).animate({ opacity: 0.75 }, 100, "easeOutExpo");
      $(that.$counter).animate({ opacity: 1 }, 100, "easeOutExpo");
      $(that.$icon).stop().animate({ backgroundSize: "100%", opacity: 1 }, 200, "easeOutExpo");
    });
  },

  show: function() {
    var that = this;

    if (!this.init) {
      this.circlePID = this._startAnimation();

      this.init = true;
    }

    this.$circle.show();

    $(this.$circle).animate({ top: '50%', marginTop:-1*(this.$circle.height()/2), opacity: 1 }, 250, function() {
      $(that.$title).animate({ opacity: 0.75 }, 150, "easeInExpo");
      $(that.$icon).animate({ backgroundSize: "100%", opacity: 1 }, 350, "easeInExpo");
      $(that.$counter).animate({ opacity: 1 }, 150, "easeInExpo");

      that.animating = false;

      that._onMouseLeave();
    });
  },

  _startAnimation: function() {
    var that = this;

    return setInterval(function() {
      that._next();
    }, 5000);
  },

  _next: function() {
    if (this.animatingB) return;

    this.animatingB = true;

    var that = this;

    $(this.$icon).animate({ backgroundSize: "10%", opacity: 0 }, 250, "easeOutExpo", function() {
      $(that.$circle).delay(200).animate({ marginLeft: -350, opacity: 0 }, 350, "easeOutQuad", function() {
        that._toggleData();

        that.$circle.css({ marginLeft: 100 });
        $(that.$circle).delay(400).animate({ marginLeft: -1*(that.$circle.height()/2), opacity: 1 }, 250, "easeOutQuad", function() {
          $(that.$icon).animate({ backgroundSize: "100%", opacity: 1 }, 250, "easeInExpo");

          that.animatingB = false;
        });
      });
    });
  },

  _toggleData: function() {
    var index = this.circles.indexOf(this.currentCircle);

    this.currentCircle = (index+1 >= this.circles.length) ? this.circles.first() : this.circles.at(index+1);

    this.render();
  },

  hide: function(e) {
    e && e.preventDefault();

    this.animating = true;

    var that = this;

    $(this.$circle).animate({ marginTop: 0, opacity: 0 }, 250, function() {
      $(this).hide();
    });
  },

  render: function() {
    this.$el.html(this.template.render( this.currentCircle.toJSON() ));

    this.$circle     = this.$el;
    this.$title      = this.$el.find(".circle-title");
    this.$icon       = this.$el.find(".circle-icon");
    this.$counter    = this.$el.find(".circle-counter");
    this.$background = this.$el.find(".circle-background");
    this.$explore    = this.$el.find(".circle-explore");

    return this.$el;
  }
});
