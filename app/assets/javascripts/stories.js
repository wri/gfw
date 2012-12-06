$(function() {

  var uploadsIds = [], drawingManager, selectedShape, selectedMarker, selectedColor;

  if ($("#map.stories_map").length > 0) {

    $(".upload_picture").on("click", function(e) {
      e.preventDefault();
      $("#fileupload").click();
    });

    $('#fileupload').fileupload({
      dataType: 'json',

      added: function (e, data) {
      console.log(e, data);
        //$.each(data.files, function (index, file) {
          //alert('Dropped file: ' + file.name);
        //});
      },
      drop: function (e, data) {
        //$.each(data.files, function (index, file) {
          //alert('Dropped file: ' + file.name);
        //});
      },

      add: function (e, data) {
        var files = data.files;

        _.each(files, function(file, i) {
        console.log(file);
          var $thumb = $("<div class='thumbnail' />");
          $(".thumbnails").append($thumb);
        });

        $(".thumbnail").each(function(i, thumb) {
          $(thumb).delay((i+1) * 300).animate({ opacity: 1 }, 350);
        });

        data.submit();

      },

      done: function (e, data) {
        $.each(data.result, function (index, file) {

          console.log("-", file);
          uploadsIds.push(file.cartodb_id);
          //$('<p/>').text(file.name).appendTo(document.body);
        });

        $("#story_uploads_ids").val(uploadsIds.join(","));
      }
    });



    var $the_geom = $('#story_the_geom');

    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: new google.maps.LatLng(-34.397, 150.644),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true
    });

    var polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.45,
      editable: true
    };


    // Creates a drawing manager attached to the map that allows the user to draw
    // markers, lines, and shapes.
    drawingManager = new google.maps.drawing.DrawingManager({
      drawingModes: [google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.MARKER],
      drawingControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.MARKER]
      },

      polygonOptions: polyOptions,
      map: map
    });

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
      if (e.type != google.maps.drawing.OverlayType.MARKER) {
        // Switch back to non-drawing mode after drawing a shape.
        drawingManager.setDrawingMode(null);
        drawingManager.path = e.overlay.getPath().getArray();

        $(".remove").fadeIn(250);
        drawingManager.setOptions({drawingControl: false});

        // Add an event listener that selects the newly-drawn shape when the user
        // mouses down on it.
        var newShape = e.overlay;
        newShape.type = e.type;
        setSelection(newShape);

        $the_geom.val(JSON.stringify({
          "type": "MultiPolygon",
          "coordinates": [
            [
              $.map(drawingManager.path, function(latlong, index) {
                return [[latlong.lng(), latlong.lat()]];
              })
            ]
          ]
        }));

      } else {

        drawingManager.setDrawingMode(null);
        $(".remove").fadeIn(250);
        drawingManager.setOptions({drawingControl: false});

        selectedMarker = e.overlay;

        $the_geom.val(JSON.stringify({
          "type": "Point",
          "coordinates": [ selectedMarker.position.lng(), selectedMarker.position.lat() ]
        }));

      }

    });

    // Clear the current selection when the drawing mode is changed, or when the
    // map is clicked.
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
    //google.maps.event.addListener(map, 'click', clearSelection);

    $('.remove').on("click", function(e){
      e.preventDefault();
      remove();
    });

    function clearSelection() {

      if (selectedShape) {
        selectedShape.setEditable(false);
        selectedShape = null;
        drawingManager.path = null;
      }

    }
    function remove() {
      deleteSelectedShape();
      deleteSelectedMarker();

      drawingManager.setOptions({ drawingControl: true });
      drawingManager.path = null;
      $the_geom.val("");

      $(".remove").fadeOut(250);
    }

    function setSelection(shape) {
      clearSelection();
      selectedShape = shape;
      shape.setEditable(true);
      selectColor(shape.get('fillColor') || shape.get('strokeColor'));
    }
    function deleteSelectedMarker() {
      console.log('a', selectedMarker);
      if (selectedMarker) {
        selectedMarker.setMap(null);
      }
    }
    function deleteSelectedShape() {
      if (selectedShape) {
        selectedShape.setMap(null);
      }
    }

    function selectColor(color) {
      selectedColor = color;

      var polygonOptions = drawingManager.get('polygonOptions');
      polygonOptions.fillColor = color;
      drawingManager.set('polygonOptions', polygonOptions);
    }

    function setSelectedShapeColor(color) {
      if (selectedShape) {
        if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
          selectedShape.set('strokeColor', color);
        } else {
          selectedShape.set('fillColor', color);
        }
      }
    }


  }


});
