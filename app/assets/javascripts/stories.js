//= require jquery-migrate-1.2.1.min
//= require jquery-ui-1.10.4.custom.min
//= require load-image.min
//= require jquery.iframe-transport
//= require jquery.fileupload
//= require gfw/ui/carrousel

var uploadsIds = [], drawingManager, selectedShape, selectedMarker, selectedColor, filesAdded = 0;

if ($("#story_uploads_ids").length > 0) {
  uploadsIds = _.compact($("#story_uploads_ids").val().split(","));
}

function prettifyFilename(filename) {
  return filename.toLowerCase().replace(/ /g,"_")
}

function getFilename(url) {
  return url.replace(/^.*[\\\/]/, '')
}

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
    this._initBindings();

    this.render();
  },

  _initBindings: function() {
    $(".upload_picture").on("click", function(e) {
      e.preventDefault();
      $("#fileupload").click();
    });

    var url = window.location.hostname === 'blueimp.github.io' ?
                '//jquery-file-upload.appspot.com/' : 'server/php/',
        uploadButton = $('<button/>')
            .addClass('btn btn-primary')
            .prop('disabled', true)
            .text('Processing...')
            .on('click', function () {
                var $this = $(this),
                    data = $this.data();
                $this
                    .off('click')
                    .text('Abort')
                    .on('click', function () {
                        $this.remove();
                        data.abort();
                    });
                data.submit().always(function () {
                    $this.remove();
                });
            });
            $(".upload_picture").on("click", function(e) {
              e.preventDefault();
              $("#fileupload").click();
            });

            $('#fileupload').fileupload({
              dataType: 'json',

              added: function (e, data) { },
              drop:  function (e, data) { },

              progress: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                //console.log("p", progress + '%');
              },

              progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                //console.log(progress + '%');
              },

              add: function (e, data) {
                var files = data.files;

                filesAdded += _.size(data.files);

                _.each(data.files, function(file) {

                  var filename = prettifyFilename(file.name);
                  var $thumbnail = $("<li class='thumbnail preview' data-name='"+filename+"' />");

                  $(".thumbnails").append($thumbnail);
                  $thumbnail.fadeIn(250);

                  var opts = {
                    lines: 11, // The number of lines to draw
                    length: 0, // The length of each line
                    width: 4, // The line thickness
                    radius: 9, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    color: '#9EB741', // #rgb or #rrggbb
                    speed: 1, // Rounds per second
                    trail: 60, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: 'auto', // Top position relative to parent in px
                    left: 'auto' // Left position relative to parent in px
                  };
                  var spinner = new Spinner(opts).spin();
                  $thumbnail.append($(spinner.el));
                  $thumbnail.append("<div class='filename'>"+ file.name +"</div>");
                });

                $("form input[type='submit']").addClass("disabled");
                $("form input[type='submit']").attr("disabled", "disabled");
                $("form input[type='submit']").val("Please wait...");

                data.submit();
              },

              done: function (e, data) {

                $.each(data.result, function (index, file) {
                  filesAdded--;

                  uploadsIds.push(file.cartodb_id);

                  var url = file.thumbnail_url.replace("https", "http");
                  var $thumb = $("<li id='photo_" + file.cartodb_id + "' class='sortable thumbnail'><div class='inner_box'><img src='"+url+"' /></div><a href='#' class='destroy'></a></li>");

                  $thumb.find(".destroy").on("click", function(e) {

                    e.preventDefault();
                    e.stopPropagation();

                    var confirmation = confirm("Are you sure?")

                    if (confirmation == true) {
                      $.ajax({
                        url: '/media/' + file.cartodb_id,
                        type: 'DELETE',
                        success: function(result) {

                          uploadsIds = _.without(uploadsIds, file.cartodb_id);
                          $("#story_uploads_ids").val(uploadsIds.join(","));

                          $thumb.fadeOut(250, function() {
                            $thumb.remove();
                          });

                        }
                      });
                    }

                  });

                  var filename = prettifyFilename(getFilename(file.image_url));

                  $(".thumbnail[data-name='"+filename+"']").fadeOut(250, function() {
                    $(this).remove();

                    $(".thumbnails").append($thumb);
                    $thumb.fadeIn(250);
                  });


                });


                if (filesAdded <= 0) {
                  $("form input[type='submit']").val("Submit story");
                  $("form input[type='submit']").removeClass("disabled");
                  $("form input[type='submit']").attr("disabled", false);
                }

                $("#story_uploads_ids").val(uploadsIds.join(","));
              }

            });
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
    if (this.model.get('the_geom') !== '') {
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
    this.$the_geom = this.$('#the_geom');
    this.$remove = this.$('.remove_story-link');

    var the_geom = this.$the_geom.val()
    this.model.set('the_geom', the_geom);

    if(the_geom) {
      this._loadMarker(JSON.parse(the_geom));
    }

    return this;
  }

});
