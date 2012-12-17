// Carrousel --------------------------------------

gfw.ui.model.Carrousel = Backbone.Model.extend({

  defaults: {
    hidden: true
  }

});

gfw.ui.view.Carrousel = gfw.core.View.extend({

  className: "gallery",

  defaults: {
    speed: 300
  },

  events: {

    "click .left"  : "onLeft",
    "click .right" : "onRight"

  },

  initialize: function() {

    //_.bindAll( this, "show", "hide", "toggle", "toggleHidden", "onLeft", "onRight", "onCancelLeft", "onCancelRight", "onKeyUp" );

    this.step = 0;

    this.options = _.extend(this.options, this.defaults);

    this.model = new gfw.ui.model.Carrousel();
    this.add_related_model(this.model);

    //this.template = new gfw.core.Template({
      //template: template,
      //type: 'mustache'
    //});

    this.render();

  },

  onKeyUp: function(e) {

    if (e.which == 27) this.onEscKey();

  },

  onEscKey: function(e) {

    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    this.trigger("onEscKey");

  },

  onRight: function() {
    if (this.step < this.sites.length - 4) {
      this.step++;
      this.$el.find(".inner").animate({ scrollLeft:  239*this.step }, this.defaults.speed);
      this.$left.fadeIn(250);
    } else {
      this.$right.fadeOut(250);
    }

  },

  onLeft: function() {
    if (this.step > 0) {
      this.step--;
      this.$el.find(".inner").animate({ scrollLeft:  239*this.step  }, this.defaults.speed);
      this.$right.fadeIn(250);
    } else {
      this.$left.fadeOut(250);
    }

  },

  toggle: function() {

    var that = this;

    if (this.model.get("hidden")) {

      $("#filters, header").animate({marginTop: 0}, { duration: this.defaults.speed, complete: function() {
        $("header, #content").off("hover");
      }

      });

      this.$handler.find("a").text("+");

    } else {

      $("#filters, header").animate({marginTop: 295}, { duration: this.defaults.speed, complete: function() {

        setTimeout(function() { // We need to give some time in order not to trigger the hover
          $("header, #content").on("hover", function() {
            that.hide();
          });
        }, 250);
      }

      });

      this.$handler.find("a").text("-");

    }

  },

  toggleHidden: function() {

    this.model.set("hidden", !this.model.get("hidden"));

  },

  show: function(callback) {
    this.model.set("hidden", false);

    callback && callback();

    return this;
  },

  hide: function(callback) {
    this.model.set("hidden", true);

    callback && callback();

    return this;
  },

  render: function() {
    var that = this;

    //this.$el.append(this.template.render( this.model.toJSON() ));

    this.$left    = this.$el.find(".left");
    this.$right   = this.$el.find(".right");

    return this.$el;

  }

});
