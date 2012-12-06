gfw.ui.model.LegendItem = Backbone.Model.extend({

});

gfw.ui.collection.LegendItems = Backbone.Collection.extend({
  model: gfw.ui.model.LegendItem
});

gfw.ui.model.Legend = Backbone.Model.extend({

  defaults: {
    hidden: true,
    layerCount: 0
  }

});

gfw.ui.view.Legend = gfw.ui.view.Widget.extend({

  className: 'legend_new',

  events: {

    "click .toggle": "_toggleOpen"

  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {

    _.bindAll( this, "add", "toggle", "toggleOpen", "toggleDraggable", "onStopDragging", "addContent", "removeContent" );

    this.options = _.extend(this.options, this.defaults);

    this.model.bind("change:hidden",    this.toggle);
    this.model.bind("change:closed",    this.toggleOpen);
    this.model.bind("change:draggable", this.toggleDraggable);

    this.model.set("containment", "#map-container .map");

    var template = $("#new-legend-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

    this.categories = {};

  },

  increaseLayerCount: function() {
    this.model.set("layerCount", this.model.get("layerCount") + 1);
  },

  decreaseLayerCount: function() {
    this.model.set("layerCount", this.model.get("layerCount") - 1);
  },

  add: function(id, category, category_title, title, color) {

    var duplicated = false;

    _.each(this.categories, function(c) {

      _.each(c.models, function(item) {
        if (item.get("cat_id") == id) duplicated = id;
      });

    });

    if (_.size(this.categories) && duplicated) {
      console.log("duplicated", duplicated);
      return;
    }

    if (!this.categories[category]) {

      this.categories[category] = new gfw.ui.collection.LegendItems;
      this.categories[category].bind("add",    this.addContent);
    }

    var item = new gfw.ui.model.LegendItem({
      cat_id:         id,
      title:          title,
      category:       category,
      category_title: category_title,
      color:          color
    });

    this.categories[category].push( item );
    this.increaseLayerCount();

  },

  remove: function(category, id) {
    var that = this;

    if (!this.categories[category]) return;

    this.categories[category].each(function(c) {

      if (c && (c.get("cat_id") == id)) {

        that.removeContent(category, id);
        that.categories[category].remove(c);

        that.decreaseLayerCount();

        if (that.categories[category].length == 0) {
          delete that.categories[category];
        }
      }

    });

  },

  removeContent: function(category, id) {

    if (this.categories[category].length == 1) {

      this.$el.find("ul." + category).fadeOut(250, function() {
        $(this).remove();
      });

      if (_.size(this.categories) == 1) {
        this.hide();
      }

    } else {

      this.$el.find("li#" + id).fadeOut(250, function() {
        $(this).remove();
      });
    }

  },

  addContent: function(item) {

    if (this.model.get("hidden")) this.show();

    if (this.categories[item.attributes.category].length == 1) {

      var template = new gfw.core.Template({
        template: $("#new-legend-group-template").html(),
        type: 'mustache'
      });

      var $item = template.render(item.attributes);
      this.$content.append( $item );
      this.$content.find("li." + item.attributes.category).fadeIn(250);
      this.$content.find("li#" + item.attributes.cat_id).fadeIn(250);

    } else {

      var template = new gfw.core.Template({
        template: $("#new-legend-item-template").html(),
        type: 'mustache'
      });

      var $item = template.render(item.attributes);
      this.$content.find("ul." + item.attributes.category).append( $item );
      this.$content.find("li#" + item.attributes.cat_id).fadeIn(250);

    }

    //this.resize();

  },

  resize: function() {

    var height = 0;

    _.each(this.categories, function(c) {
      //console.log(c.length);
    });


    //this.$content.animate({ height: height }, this.options.speed);

  },

  _toggleOpen: function() {

    this.model.get("closed") ? this.open() : this.close();

  },

  toggleOpen: function() {

    var that = this;

    if (this.model.get("closed")) {

      that.model.set("contentHeight", that.$content.height());
      that.$content.animate({ opacity: 0, height: that.defaults.minHeight }, that.defaults.speed, function() {
        that.$layer_count.fadeIn(250);
      });

      that.$el.addClass("closed");

    } else {

      that.$layer_count.fadeOut(250, function() {
        that.$content.animate({ opacity: 1, height: that.model.get("contentHeight") }, that.defaults.speed);
      });
      that.$el.removeClass("closed");

    }

  },

  open: function(callback) {
    this.model.set("closed", false);

    callback && callback();

    return this;
  },

  close: function(callback) {
    this.model.set("closed", true);

    callback && callback();

    return this;
  },

  render: function() {
    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$content     = this.$el.find(".content");
    this.$layer_count = this.$el.find(".layer_count");

    return this.$el;

  }

});
