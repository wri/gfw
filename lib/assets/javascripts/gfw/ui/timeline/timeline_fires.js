gfw.ui.model.TimelineFires = cdb.core.Model.extend({
  defaults: {
    hidden: true,
  }
});

gfw.ui.view.TimelineFires = gfw.ui.view.Widget.extend({
  className: 'timeline timeline_fires',

  events: {
    'click .quarters li .year': '_onClickYear'
  },

  initialize: function() {
    var today = new Date();

    _.bindAll(this, 'toggle');

    this.model = new gfw.ui.model.TimelineFires({
      end_day: new Date(today.setDate(today.getDate() - 8))
    });

    // Bindings
    this.model.on('change:hidden',  this.toggle);
    this.model.on('change:line',    this._onChangeLine, this);

    var template = $("#timeline_fires-template").html();

    this.template = new cdb.core.Template({
      template: template,
      type: 'mustache'
    });
  },

  show: function() {
    if (Analysis.analyzing) return;

    this.model.set('hidden', false);
    if (typeof $map_coordinates !== 'undefined') $map_coordinates.hide();
  },

  hide: function() {
    this.model.set('hidden', true);
  },

  updateCoordinates: function() {
    if (this.initialized) this.$coordinates.html('Lat/Long: '+map.getCenter().lat().toFixed(6)+', '+map.getCenter().lng().toFixed(6));
  },

  updateMap: function() {
    publish('timeline:change_date_fires', [this.model.get('end_day')]);
  },

  _onClickYear: function(e){
    e && e.preventDefault();

    this.$years.find('.selected').removeClass('selected');
    $(e.target).addClass('selected');
    
    var today = new Date();
    this.model.set('end_day', new Date(today.setDate(today.getDate() - 8)));

    switch ($(e.target).data('quarter')) {
      case 1: 
        this.model.set('end_day', new Date(this.model.get('end_day').setDate(this.model.get('end_day').getDate() + 6)) );
      break;

      case 2:
        this.model.set('end_day', new Date(this.model.get('end_day').setDate(this.model.get('end_day').getDate() + 5)) );
      break;

      case 3:
        this.model.set('end_day', new Date(this.model.get('end_day').setDate(this.model.get('end_day').getDate() + 4)) );
      break;

      case 7:
      default:
        this.model.set('end_day', this.model.get('end_day'));
    }

    this.updateMap();
  },

  _onChangeLine: function() {
    if (this.model.get('fadeIn')) {
      $(this.$line).animate({ left: this.model.get('line') }, 150);
    } else {
      this.$line.css('left', this.model.get('line'));

      this.$line.fadeIn();

      this.model.set('fadeIn', true);
    }
  },


  _init: function() {
    this.$line          = this.$el.find('.line');
    this.$tipsy         = this.$line.find('.tipsy');
    this.$years         = this.$el.find('.quarters');
    this.$months        = this.$el.find('.visible_quarters');
    this.$coordinates   = this.$el.find('.timeline_coordinates');
    $map_coordinates    = this.$el.closest('.map').siblings('.map_coordinates');


    this.initialized = true;

    this.updateCoordinates();
    this.updateMap();
  },

  toggle: function() {
    var that = this;

    if (this.model.get('hidden')) {
      if(this.$el.is(':visible')) {
        this.$el.fadeOut(200);
      } else {
        this.$el.hide();
      }
    } else {
      this.$el.fadeIn(200, function() {
        if (that.initialized) {
          that.updateMap();
        } else {
          that._init();
        }
      });
    }
  },

  render: function() {
    this.$el.append(this.template.render( this.model.toJSON() ));
    return this.$el;
  }
});
