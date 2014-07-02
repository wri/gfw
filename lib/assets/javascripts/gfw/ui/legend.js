gfw.ui.model.LegendItem = Backbone.Model.extend();

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
  className: 'legend',

  events: {
    'click .toggle': '_toggleOpen'
  },

  initialize: function() {
    _.bindAll(this, 'add', 'replace', 'toggle', 'toggleOpen', 'toggleDraggable', 'onStopDragging', 'addContent', 'removeContent');

    this.options = _.extend(this.options, this.defaults);

    this.model = new gfw.ui.model.Legend();

    this.add_related_model(this.model);

    this.model.bind('change:hidden',    this.toggle);
    this.model.bind('change:closed',    this.toggleOpen);
    this.model.bind('change:draggable', this.toggleDraggable, this);

    this.model.set('containment', '#map-container .map');
    var template = $('#legend-template').html();

    this.template = new cdb.core.Template({
      template: template,
      type: 'mustache'
    });

    this.categories = {};
  },

  addScroll: function() {
    if (!this.model.get('scrollbar')) {
      this.model.set('scrollbar', true);
      this.$el.find('.content').jScrollPane();
      this.api = this.$el.find('.content').data('jsp');
    } else {
      this.refreshScroll();
    }
  },

  refreshScroll:function() {
    if (this.api) this.api.reinitialise();
  },

  increaseLayerCount: function() {
    this.model.set('layerCount', this.model.get('layerCount') + 1);
  },

  decreaseLayerCount: function() {
    this.model.set('layerCount', this.model.get('layerCount') - 1);
  },

  show: function(callback) {
    if (!showMap) return;

    if (this.model.get('layerCount') === 0) {
      this.model.set('hidden', true);
    } else {
      this.model.set('hidden', false);
    }

    if (!this.model.get('closed')) this.resize();

    callback && callback();

    return this;
  },

  toggleItemBySlug: function(slug) {
    var that = this;

    $('.legend .' + slug).toggle();

    setTimeout( function() { that.resize(); }, 300);
  },

  toggleItem: function(id, category, category_title, title, slug, category_color, title_color, subevent) {
    if(!this.categories[category] || !this.isAdded(id)) {
      this.add(id, category, category_title, title, slug, category_color, title_color, subevent);
    } else {
      this.remove(id);
    }
  },

  findItem: function(id) {
    var foundItem = null;

    _.each(this.categories, function(c) {
      _.each(c.models, function(item) {
        if (item.get('cat_id') == id) foundItem = item;
      });
    });

    return foundItem;
  },

  isAdded: function(id) {
    var duplicated = false;

    _.each(this.categories, function(c) {
      _.each(c.models, function(item) {
        if (item.get('cat_id') == id) duplicated = id;
      });
    });

    return duplicated;
  },

  replace: function(id, category, category_title, title, slug, category_color, title_color, subevent) {
    var that = this;

    if(this.categories[category]) {
      _.each(this.categories[category].models, function(c) {
        that.removeContent(category, c.get('cat_id'));
        that.categories[category].remove(c);

        that.decreaseLayerCount();
      });
    }

    this.add(id, category, category_title, title, slug, category_color, title_color, subevent);
  },

  removeCategory: function(category) {
    var that = this;

    if(this.categories[category]) {
      _.each(this.categories[category].models, function(c) {
        if (c) {
          that.removeContent(category, c.get('cat_id'));
          that.categories[category].remove(c);

          that.decreaseLayerCount();
        }
      });

      if (that.categories[category].length == 0) {
        delete that.categories[category];
      }
    }

    setTimeout( function() { that.resize(); }, 300);
  },

  add: function(id, category, category_title, title, slug, category_color, title_color, subevent) {
    var that = this;

    if (_.size(this.categories) && this.isAdded(id)) return;

    this.open(function() {
      if (!that.categories[category]) {
        that.categories[category] = new gfw.ui.collection.LegendItems;
        that.categories[category].bind('add', that.addContent);
      }

      var item = new gfw.ui.model.LegendItem({
        cat_id:         id,
        title:          title,
        slug:           slug,
        category:       category,
        category_title: category_title,
        category_color: category_color,
        title_color:    title_color,
        sublayer:       subevent ? true : false,
        subevent:       subevent
      });

      that.categories[category].push( item );
      that.increaseLayerCount();
      if ($('body').hasClass('embed')){
        that.$el.css('left','-99999px');
        that.show();
        that.hide();
      } else {
        that.show();
      }
    });

  },

  remove: function(id) {
    var that     = this;
    var item     = this.findItem(id);

    if (!item) return;

    this.open(function() {
      var category = item.get('category');

      if (!that.categories[category]) return;

      that.categories[category].each(function(c) {
        if (c && (c.get('cat_id') == id)) {
          that.removeContent(category, id);
          that.categories[category].remove(c);

          that.decreaseLayerCount();

          if (that.categories[category].length == 0) {
            delete that.categories[category];
          }
        }
      });

      setTimeout( function() { that.resize(); }, 300);
    });
  },

  removeContent: function(category, id, hide) {
    if (this.categories[category].length == 1) {
      this.$el.find('ul.' + category).fadeOut(250, function() {
        $(this).remove();
      });

      if (!hide && _.size(this.categories) == 1) {
        this.hide();
      }
    } else {
      this.$el.find('li#' + id).fadeOut(250, function() {
        $(this).remove();
      });
    }
  },

  addContent: function(item) {
    var that = this;

    var slug = item.get('slug');

    if (this.categories[item.attributes.category].length == 1) {
      var template_name;

      if (slug == 'imazon') {
        template_name = 'legend-group-double-template';
      } else if (slug == 'umd_tree_loss_gain') {
        template_name = 'legend-loss-template';
      } else if ( slug == 'idn_primary') {
        template_name = 'legend-idn-primary-template';
      } else {
        template_name = 'legend-group-template';
      }

      var template = new cdb.core.Template({
        template: $('#' + template_name).html(),
        type: 'mustache'
      });

      if (slug == 'forest2000') {
        //item.attributes.legend = 'Percent Tree Cover';
        //item.attributes.legend_class = 'tree';

        //item.attributes.colors = [{ color: '#9DD89D', title: '25-50%' }, { color: '#4EC54E', title: '50-75%' }, { color: '#00B300', title: '75-100%' } ];
      } else if (slug == 'pantropical') {
        item.attributes.legend = "Total Biomass <span class='units'>(Mg C Ha<sup>-1</sup>)</span>";
        item.attributes.legend_class = '';
        item.attributes.min = '75';
        item.attributes.max = '383';
        item.attributes.wide = [{ 'color_min': '#FFFFD4', 'color_max': '#dd8653'} ];
      } else {
        item.attributes.legend = false;
      }

      var $item = template.render(item.attributes);

      if (this.model.get('scrollbar')) {
        this.$content.find('.jspPane').prepend( $item );
      } else {
        this.$content.append( $item );
      }

      this.$content.find('li.' + item.attributes.category).fadeIn(250);
      this.$content.find('li#' + item.attributes.cat_id + '.degraded').fadeIn(250);
      this.$content.find('li#' + item.attributes.cat_id + '.intact').fadeIn(250);

      if (config.BASELAYER && config.BASELAYER.indexOf('loss') === 0) {
        this.$content.find('li#' + item.attributes.cat_id + '.loss').fadeIn(250);
      }

      if (_.include(config.MAPOPTIONS.layers, 596)) {
        this.$content.find('li#' + item.attributes.cat_id + '.forestgain').fadeIn(250);
      }


    } else {
      var template_name;

      template_name = '#legend-item-template';

      var template = new cdb.core.Template({
        template: $(template_name).html(),
        type: 'mustache'
      });

      if (slug == 'forest2000') {
        item.attributes.legend = 'Percent Tree Cover';
        item.attributes.legend_class = 'tree';
        item.attributes.colors = [{ color: '#9DD89D', title: '25-50%' }, { color: '#4EC54E', title: '50-75%' }, { color: '#00B300', title: '75-100%' } ];
      } else if (slug == 'pantropical') {
        item.attributes.legend = "Total Biomass Carbon <span class='units'>(Mg C Ha<sup>-1</sup>)</span>";
        item.attributes.legend_class = '';
        item.attributes.min = '75';
        item.attributes.max = '383';
        item.attributes.wide = [{ 'color_min': '#FFFFD4', 'color_max': '#dd8653'} ];
      } else {
        item.attributes.legend = false;
      }

      var $item = template.render(item.attributes);

      this.$content.find('ul.' + item.attributes.category).append( $item );
      this.$content.find('li#' + item.attributes.cat_id).fadeIn(250);
    }

    setTimeout(function() {
      that.$el.find('.checkbox').on('click', function(e) {
        e.preventDefault();

        item.attributes.subevent && item.attributes.subevent();
      });

      that.resize();
    }, 300);
  },

  resize: function() {
    var that = this;

    var height = this.$el.find('.jspPane').height();

    this.$content.animate({ height: height }, { duration: 100, complete: function() {
      that.addScroll();
    }});
  },

  toggleOpen: function() {
    var that = this;

    if (this.model.get('closed')) {
      that.model.set('contentHeight', that.$content.height());

      if (that.model.get('layerCount') != 1) {
        that.$layer_count.html( that.model.get('layerCount') + ' layers');
      } else {
        that.$layer_count.html( that.model.get('layerCount') + ' layer');
      }

      that.$content.animate({ opacity: 0, height: 0 }, 250, function() {
        that.$layer_count.fadeIn(250);
        that.$shadow.fadeOut(250);
      });

      that.$el.addClass('closed');
    } else {
      that.$layer_count.fadeOut(250, function() {
        that.$content.animate({ opacity: 1, height: that.model.get('contentHeight') }, 250);
        that.$shadow.fadeIn(250);
      });

      that.$el.removeClass('closed');
    }
  },

  render: function() {
    var that = this;
    this.$el.append(this.template.render( this.model.toJSON() ));
    this.$content     = this.$el.find('.content');
    this.$layer_count = this.$el.find('.layer_count');
    this.$shadow      = this.$el.find('.shadow');

    if ($('body').hasClass('embed')){
      this.$el.hide();
      setTimeout(function(){
        that.model.set('closed', true);
        that.toggleOpen;
        that.$el.css('left','60px').delay(300).fadeIn();
      },1000)
    }

    return this.$el;
  }
});
