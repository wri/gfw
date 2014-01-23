//= require ui/carrousel

gfw.ui.view.StoriesEdit = cdb.core.View.extend({

  el: document.body,

  events: {
    'click .remove_story-link': '_clickRemove'
  },

  initialize: function() {
    _.bindAll(this, '_clickRemove');

    var that = this;

    this.model = new cdb.core.Model();

    this.model.bind('change:the_geom', this._toggleButton, this);

    this.selectedMarker = {};

    this._initViews();

    this.render();
  },

  _initViews: function() {
    var that = this;

    this.map = new google.maps.Map(document.getElementById('stories_map'), config.MAPOPTIONS);

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER
        ]
      },
      markerOptions: {
        icon: config.OVERLAYSTYLES.icon
      }
    });

    this.drawingManager.setMap(this.map);

    google.maps.event.addListener(this.drawingManager, 'markercomplete', function(marker) {
      that._onOverlayComplete(marker);
    });
  },

  _loadMarker: function(the_geom) {
    var that = this;

    var marker = this.selectedMarker = new GeoJSON(the_geom, config.OVERLAYSTYLES);

    if (marker.type && marker.type === 'Error') return;

    var bounds = new google.maps.LatLngBounds();

    marker.setMap(this.map);
    bounds.extend(marker.position);
    this.map.fitBounds(bounds);

    setTimeout(function() {
      that.map.setZoom(2);
    }, 250);
  },

  _onOverlayComplete: function(marker) {
    var marker = this.selectedMarker = marker;

    var the_geom = JSON.stringify({
      "type": "Point",
      "coordinates": [ marker.position.lng(), marker.position.lat() ]
    });

    this.model.set('the_geom', the_geom);
  },

  _clickRemove: function(e) {
    e.preventDefault();

    this.selectedMarker.setMap(null);

    this.model.set('the_geom', '');
  },

  _toggleButton: function() {
    if(this.model.get('the_geom') !== '') {
      this.$the_geom.val(this.model.get('the_geom'));
      this.drawingManager.setOptions({ drawingControl: false });
      this.$remove.fadeIn(250);
    } else {
      this.$the_geom.val('');
      this.drawingManager.setOptions({ drawingControl: true });
      this.$remove.fadeOut(250);
    }
  },

  render: function() {
    this.$the_geom = this.$('#story_the_geom');
    this.$remove = this.$('.remove_story-link');

    var the_geom = this.$the_geom.val()
    this.model.set('the_geom', the_geom);

    if(the_geom) {
      this._loadMarker(JSON.parse(the_geom));
    }

    return this;
  }

});
