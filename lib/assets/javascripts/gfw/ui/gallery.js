gfw.ui.model.Site = Backbone.Model.extend({
  defaults: {
    selected: false
  }
});

gfw.ui.collection.Sites = Backbone.Collection.extend({
  model: gfw.ui.model.Site
});


// Gallery --------------------------------------

gfw.ui.model.Gallery = Backbone.Model.extend({

  defaults: {
    hidden: true
  }

});

gfw.ui.view.Gallery = gfw.core.View.extend({

  id: "gallery",

  defaults: {
    speed: 300
  },

  events: {

    "click .left"  : "onLeft",
    "click .right" : "onRight"

  },

  initialize: function() {

    _.bindAll( this, "show", "hide", "toggle", "toggleHidden", "onLeft", "onRight", "onCancelLeft", "onCancelRight", "onKeyUp" );

    this.step = 0;

    this.options = _.extend(this.options, this.defaults);


    var sites = [
      new gfw.ui.model.Site({ title: "WRI", description: "Focusing on the intersection of the environment and socio-economic development.", url: "http://www.wri.org/", thumb_url: "/assets/sites/site_wri.png" }),
      new gfw.ui.model.Site({ title: "WRInsights", description: "Unbiased, expert analysis on the most important environmental issues facing the world today.", url: "http://insights.wri.org/", thumb_url: "/assets/sites/site_wriinsights.png" }),
      new gfw.ui.model.Site({ title: "WRI In China",  description: "To be completed.", url: "http://www.wri.org.cn/", thumb_url: "/assets/sites/site_wriinchina.png" }),
      new gfw.ui.model.Site({ title: "ChinaFAQs",  description: "To be completed", url: "http://www.chinafaqs.org/", thumb_url: "/assets/sites/site_chinafaqs.png" }),
      new gfw.ui.model.Site({ title: "TheCity Fix", description: "To be completed", url: "http://thecityfix.com/", thumb_url: "/assets/sites/site_thecityfix.png" }),
      new gfw.ui.model.Site({ title: "Climate Analysis Indicators", description: "To be completed",  url: "http://www.wri.org/tools/cait/", thumb_url: "/assets/sites/site_climateanalysis.png" }),
      new gfw.ui.model.Site({ title: "Electricity Governance", description: "To be completed", url: "http://electricitygovernance.wri.org/", thumb_url: "/assets/sites/site_electricity.png" }),
      new gfw.ui.model.Site({ title: "EMBARQ", description: "To be completed", url: "http://www.embarq.org/", thumb_url: "/assets/sites/site_embarq.png" }),
      new gfw.ui.model.Site({ title: "Forest Legality Alliance", description: "Reducing illegal logging through supporting the supply of legal forest products.", url: "http://www.forestlegality.org/", thumb_url: "/assets/sites/site_forestlegality.png" }),
      new gfw.ui.model.Site({ title: "New Ventures", description: "To be completed", url: "http://www.new-ventures.org/", thumb_url: "/assets/sites/site_newventures.png" }),
      new gfw.ui.model.Site({ title: "Southern Forests for the Future", description: "Raise awareness about the forests of the southern United States", url: "http://www.seesouthernforests.org/", thumb_url: "/assets/sites/site_southernforests.png" }),
      new gfw.ui.model.Site({ title: "World Resources Report", description: "How can the world adequately feed more than 9 billion people by 2050?", url: "http://www.worldresourcesreport.org/", thumb_url: "/assets/sites/site_worldresources.png" })
    ];

    this.sites = new gfw.ui.collection.Sites(sites);

    this.model = new gfw.ui.model.Gallery();
    this.add_related_model(this.model);

    this.model.bind("change:hidden", this.toggle);

    var title = this.options.title || "Other WRI sites";
    this.model.set("title", title);

    var template = $("#gallery-template").html();

    $(document).on("keyup", this.onKeyUp);

    var that = this;

    this.bind("onEscKey", this.hide);

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

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

  onRight: function(e) {

  e && e.preventDefault();
  e && e.stopPropagation();

    if (this.step < this.sites.length - 4) {
      this.step++;
      this.$el.find(".inner").animate({ scrollLeft:  239*this.step }, this.defaults.speed);
      this.$left.fadeIn(250);
    } else {
      this.$right.fadeOut(250);
    }

  },

  onLeft: function(e) {

  e && e.preventDefault();
  e && e.stopPropagation();

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

    this.$el.show();
    this.model.set("hidden", !this.model.get("hidden"));

  },

  renderSites: function() {
    var that = this;

    var template = new gfw.core.Template({
      template: $("#gallery_item-template").html(),
      type: 'mustache'
    });

    this.sites.each(function(layer) {
      that.$gallery.find("ul").append(template.render( layer.toJSON() ));
    });

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

  addHandler: function(el) {

    this.$handler = $(el);

    this.$handler.on("click", this.toggleHidden);

  },

  render: function() {
    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$gallery = this.$el.find(".gallery");
    this.$left    = this.$el.find(".left");
    this.$right   = this.$el.find(".right");

    $("body").append(this.$el);

    this.renderSites();

    return this.$el;

  }

});
