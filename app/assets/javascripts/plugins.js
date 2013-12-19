var CountryFeed = (function() {
  function getNews() {
    var googleAPI = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=",
        url = "http://globalforestwatch.tumblr.com/rss";

    // Use Tumblr RSS
    $.getJSON(googleAPI + url + "&callback=?", function(data) {
      $.each(data.responseData.feed.entries, function(key, val) {
        if($.inArray(countryKeyword, val.categories) > -1) {
          $(".blog-links .first").html('<p class="subtitle">Blog stories</p><h4><a href="'+val.link+'" target="_blank" title="'+val.title+'">'+val.title+'</a></h4><p>'+truncate(val.content, 300, val.link)+'</p>');

          return;
        }
      });
    });
  }

  function getMongabayNews() {
    var url = "https://wri-01.cartodb.com/api/v2/sql?q=SELECT * FROM mongabaydb WHERE position('" + countryKeyword + "' in keywords) <> 0";

    // Use Mongabay News RSS
    $.getJSON(url, function(data) {
      if(data.total_rows > 0) {
        var val = data.rows[0];

        $(".blog-links .last").html('<p class="subtitle">Mongabay stories</p><h4><a href="'+val.loc+'" target="_blank" title="'+val.title+'">'+truncate_title(val.title, 35)+'</a></h4><p>'+truncate(val.description, 300, val.loc)+'</p>');
      }
    });
  }

  function truncate_title(string, limit) {
    if (string.length > limit) {
      var string_truncated = string.substring(0, limit);
      string_truncated = string_truncated.replace(/w+$/, '');

      string_truncated += '...';
      return string_truncated;
    }
    return string;
  }

  function truncate(string, limit, url) {
    if (string.length > limit) {
      var string_truncated = string.substring(0, limit);
      string_truncated = string_truncated.replace(/w+$/, '');

      string_truncated += '... <a href="' + url + '"  target="_blank">more</a>.';
      return string_truncated;
    }
    return string;
  }

  return {
    getNews: getNews,
    getMongabayNews: getMongabayNews
  }
}());

var CountryMenu = (function() {

  var drawn = false;

  function show(e) {

    e.preventDefault();
    e.stopPropagation();

    var that = this;

    $(".countries_backdrop").fadeIn(250);
    $("#countries").fadeIn(250);

    if (!drawn) drawCountries();

  }

  function drawForest(iso) {
    d3.json("https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20unnest(array['type_primary',%20'type_regenerated',%20'type_planted'])%20AS%20type,%20unnest(array[type_primary,%20type_regenerated,%20type_planted])%20AS%20percent%20FROM%20gfw2_countries%20WHERE%20iso%20=%20'"+iso+"'", function(data) {
      var svg = d3.select(".state .line-graph")
        .append("svg")
        .attr("width", 635)
        .attr("height", 26);

      var x_extent = [0, 100],
          x_scale = d3.scale.linear()
                      .range([0,625])
                      .domain(x_extent);

      var origins = [],
          aggr = 0,
          klass = ['one', 'three', 'four'];

      _.each(data.rows, function(d, i) {
        var current = data.rows[i-1] && data.rows[i-1]['percent'] || 0;

        aggr += current;

        origins[i] = aggr;
      });

      svg.selectAll("rect")
        .data(data.rows)
        .enter()
        .append("rect")
        .attr("class", function(d, i) {
          return klass[i];
        })
        .attr("x", function(d, i) {
          return x_scale(origins[i]);
        })
        .attr("y", 6)
        .attr("width", function(d) {
          return x_scale(d['percent']);
        })
        .attr("height", 4);

      // add balls
      svg.selectAll("circle")
        .data(data.rows)
        .enter()
        .append("circle")
        .attr("class", function(d, i) {
          return klass[i];
        })
        .attr("cx", function(d, i) {
          return x_scale(d['percent']+origins[i]);
        })
        .attr("cy", 8)
        .attr("r", 5)

      // add values
      svg.selectAll("text")
        .data(data.rows)
        .enter()
        .append("text")
        .text(function(d) {
          return d['percent'] + "%";
        })
        .attr("class", function(d, i) {
          return klass[i];
        })
        .attr("x", function(d, i) {
          return x_scale(d['percent']+origins[i]-2);
        })
        .attr("y", 24);
    });
  }

  function drawTenure(iso) {
    d3.json("https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20tenure_government,%20tenure_owned,%20tenure_owned_individuals,%20tenure_reserved,%20greatest(tenure_government,%20tenure_owned,%20tenure_owned_individuals,%20tenure_reserved)%20as%20max%20FROM%20gfw2_countries%20WHERE%20iso%20=%20'"+iso+"'", function(data) {

      var svg = d3.select(".tenure .line-graph")
        .append("svg")
        .attr("width", 560)
        .attr("height", 16 * 4);

      var x_extent = [0, data.rows[0].max],
          x_scale = d3.scale.linear()
                      .range([0,500])
                      .domain(x_extent);

      var origins = [],
          aggr = 0,
          klass = ['one', 'two', 'three', 'four']

      var tenures = [
        {
          name: 'Government Administered',
          percent: data.rows[0].tenure_government
        },
        {
          name: 'Owned by Communities and Indigenous Groups',
          percent: data.rows[0].tenure_owned
        },
        {
          name: 'Owned by Firms and Individuals',
          percent: data.rows[0].tenure_owned_individuals
        },
        {
          name: 'Reserved for Communities and Indigenous Groups',
          percent: data.rows[0].tenure_reserved
        }
      ];

      var tenures_ord = [];

      _.each(tenures, function(tenure, i) {
        if(tenure['percent'] !== 0) {
          tenures_ord.push({
            name: tenure['name'],
            percent: tenure['percent']
          });
        }
      });

      svg.selectAll("rect")
        .data(tenures_ord)
        .enter()
        .append("rect")
        .attr("class", function(d, i) {
          return klass[i];
        })
        .attr("x", function() {
          return x_scale(0);
        })
        .attr("y", function(d, i) {
          return 3 + (16 * i)
        })
        .attr("width", function(d) {
          return x_scale(d['percent']);
        })
        .attr("height", 4);

      // add balls
      svg.selectAll("circle")
        .data(tenures_ord)
        .enter()
        .append("circle")
        .attr("class", function(d, i) {
          return klass[i];
        })
        .attr("cx", function(d, i) {
          return x_scale(d['percent']);
        })
        .attr("cy", function(d, i) {
          return 5 + (16 * i)
        })
        .attr("r", 5);

      // add values
      svg.selectAll("text")
        .data(tenures_ord)
        .enter()
        .append("text")
        .text(function(d) {
          return d['percent']/1000000.0 + "Mha";
        })
        .attr("class", function(d, i) {
          return klass[i];
        })
        .attr("x", function(d, i) {
          return x_scale(d['percent'])+10;
        })
        .attr("y", function(d, i) {
          return 9 + (16 * i)
        });

      // add legend
      d3.select(".tenure .legend-graph")
        .selectAll("p")
        .data(tenures_ord)
        .enter()
        .append("p")
        .text(function(d) {
          return d['name'];
        })
        .attr("class", function(d, i) {
          return klass[i];
        });
    });
  }

  function drawCountry(iso) {
    d3.json("https://wri-01.cartodb.com/api/v2/sql?q=SELECT the_geom FROM forest_cov_glob_v3 WHERE country_code = '"+iso+"' UNION SELECT the_geom FROM ne_50m_admin_0_countries WHERE adm0_a3 = '"+iso+"'&format=topojson", function(error, topology) {
      draw(topology, 0, iso, {alerts: true});
    });
  }

  function draw(topology, c, iso, options) {
    if(!options) {
      var width = 200,
          height = 120,
          icon = "icon";
    } else if(options) {
      var width = 300,
          height = 250,
          icon = "country";
    }

    // c is index for country
    var country = topojson.feature(topology, topology.objects[c]);

    var svg = d3.select("#"+icon+iso).append("svg")
      .attr("width", width)
      .attr("height", height);

    var projection = d3.geo.mercator().scale(1).translate([0, 0]);
    var path = d3.geo.path().projection(projection);

    var b = path.bounds(country),
        s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
      .scale(s)
      .translate(t);

    svg.append("path")
      .data([country])
      .attr("d", path);

    if(options && options.alerts) {
      var forest = [];

      for(var i = 1; i < Object.keys(topology.objects).length; i++) {
        forest.push(topojson.feature(topology, topology.objects[i]).geometry);
      }

      svg.append("g")
        .selectAll("circle")
        .data(forest)
        .enter()
        .append("circle")
        .attr("class", "alert")
        .attr('cx', function(d){
          var coordinates = projection([d.coordinates[0], d.coordinates[1]])
          return coordinates[0]
        })
        .attr('cy', function(d){
          var coordinates = projection([d.coordinates[0], d.coordinates[1]])
          return coordinates[1]
        })
        .attr('r', 2)
        .style("fill", "#AAC600");
    }
  }

  function drawCountries() {
    d3.json("https://wri-01.cartodb.com/api/v2/sql?q=SELECT adm0_a3 as iso, the_geom FROM ne_50m_admin_0_countries&format=topojson", function(topology) {
      for (var i = 0; i < Object.keys(topology.objects).length; i++) {
        var iso = topology.objects[i].properties.iso;

        draw(topology, i, iso);
      }
    });
  }

  function initDropdown() {
    $('.forma_dropdown-link').qtip({
      show: 'click',
      hide: {
        event: 'click unfocus'
      },
      content: {
        text: $('.forma_dropdown-menu')
      },
      position: {
        my: 'top right',
        at: 'bottom right',
        target: $('.forma_dropdown-link'),
        adjust: {
          x: 10
        }
      },
      style: {
        tip: {
          corner: 'top right',
          mimic: 'top center',
          border: 1,
          width: 10,
          height: 6
        }
      }
    });

    $('.selector').on('click', function(event) {
      api.hide();
    })
  }

  function drawCircle(id, type, options) {
    var $graph = $("."+id),
        $title = $graph.find(".graph-title"),
        $ammount = $graph.find(".graph-amount"),
        $date = $graph.find(".graph-date");
        $coming_soon = $graph.find(".coming_soon");

    $(".frame_bkg").empty();
    $graph.addClass('ghost');
    $title.html(title);
    $ammount.html("");
    $date.html("");
    $coming_soon.hide();

    var width     = options.width     || 310,
        height    = options.height    || width,
        title     = options.title     || "",
        subtitle  = options.subtitle  || "",
        h         = 100, // maxHeight
        radius    = width / 2;

    var graph = d3.select("."+ id+" .frame_bkg")
      .append("svg:svg")
      .attr("class", type)
      .attr("width", width)
      .attr("height", height);

    var sql = "SELECT date_trunc('month', date) as date, COUNT(*) as alerts\
              FROM cdm_latest\
              WHERE iso = '"+options.iso+"'\
              GROUP BY date_trunc('month', date)\
              ORDER BY date_trunc('month', date) ASC"

    if (type === 'lines') {
      d3.json("https://wri-01.cartodb.com/api/v2/sql?q="+sql, function(json) {
        if(json) {
          $graph.removeClass('ghost');

          var data = json.rows.slice(1, json.rows.length - 1);
        } else {
          $coming_soon.show();

          return;
        }

        var x_scale = d3.scale.linear()
              .domain([0, data.length - 1])
              .range([0, width - 80]);

        var y_scale = d3.scale.linear()
              .domain([0, d3.max(data, function(d) {return d.alerts})])
              .range([0, h]);

        var line = d3.svg.line()
              .x(function(d, i) { return x_scale(i); })
              .y(function(d, i) { return h - y_scale(d.alerts); })
              .interpolate("basis");

        var marginLeft = 40,
            marginTop = radius - h/2;

        $ammount.html(data[0].alerts);
        var date = new Date(data[0].date),
            form_date = "Alerts in " + config.MONTHNAMES[date.getMonth()] + " " + date.getFullYear();
        $date.html(form_date);

        graph.append("svg:path")
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
          .attr("d", line(data))
          .on("mousemove", function(d) {
            var index = Math.round(x_scale.invert(d3.mouse(this)[0]));

            if (data[index]) { // if there's data
              var val = data[index].alerts;
              $ammount.html(val);

              var date = new Date(data[index].date),
                  form_date = "Alerts in " + config.MONTHNAMES[date.getMonth()] + " " + date.getFullYear();

              $date.html(form_date);

              var cx = d3.mouse(this)[0] + marginLeft;
              var cy = h - y_scale(data[index].alerts) + marginTop;

              graph.select(".forma_marker")
                .attr("cx", cx)
                .attr("cy", cy);
            }
          });

        graph.append("svg:circle")
          .attr("class", "forma_marker")
          .attr("cx", -10000)
          .attr("cy",100)
          .attr("r", 5);
      });
    } else if (type === 'bars') {
      var sql = 'SELECT ';

      for(var y = 2001; y < 2012; y++) {
        sql += "y"+y+", "
      }

      sql += "y2012\
              FROM "+options.dataset+"\
              WHERE iso = '"+options.iso+"'";

      d3.json("https://wri-01.cartodb.com/api/v2/sql?q="+sql, function(json) {
        if(json) {
          $graph.removeClass('ghost');

          var data = json.rows[0];
        } else {
          $coming_soon.show();

          return;
        }

        var data_ = [];

        _.each(data, function(val, key) {
          data_.push({
            "year": key.replace("y",""),
            "value": val
          });
        });

        $ammount.html(data_[0].value);
        $date.html("M Hectares in " + data_[0].year);

        var marginLeft = 40,
            marginTop = radius - h/2;

        var y_scale = d3.scale.linear()
              .domain([0, d3.max(data_, function(d) { return d.value; })])
              .range([height - marginTop, marginTop*2]);

        var barWidth = (width - 80) / data_.length;

        var bar = graph.selectAll("g")
              .data(data_)
              .enter().append("g")
              .attr("transform", function(d, i) { return "translate(" + (marginLeft + i * barWidth) + "," + -marginTop + ")"; });

        bar.append("svg:rect")
              .attr("class", function(d, i) {
                if(i === 0) {
                  return "first bar"
                } else {
                  return "bar"
                }
              })
              .attr("y", function(d) { return y_scale(d.value); })
              .attr("height", function(d) { return height - y_scale(d.value); })
              .attr("width", barWidth - 1)
              .style("fill", "#FFC926")
              .style("shape-rendering", "crispEdges")
              .on("mouseover", function(d) {
                d3.selectAll(".bar").style("opacity", ".5");
                d3.select(this).style("opacity", "1");

                $ammount.html(d.value);
                $date.html("M Hectares in " + d.year);
              });
      });
    } else if (type === 'comp') {
      var sql = 'SELECT gain.hectares as total_gain, (SELECT SUM(';

      for(var y = 2001; y < 2012; y++) {
        sql += "loss.y"+y+"+";
      }

      sql += "loss.y2012) FROM hansen_forest_loss loss WHERE loss.iso = gain.iso) as total_loss FROM hansen_forest_gain gain WHERE gain.iso = '"+options.iso+"'";

      d3.json("https://wri-01.cartodb.com/api/v2/sql?q="+encodeURIComponent(sql), function(json) {
        if(json) {
          $graph.removeClass('ghost');

          var data = json.rows[0];
        } else {
          $coming_soon.show();

          return;
        }

        var data_ = [],
            form_key = {
              "total_gain": "Forest Cover Gain",
              "total_loss": "Forest Cover Loss"
            };

        _.each(data, function(val, key) {
          data_.push({
            "key": form_key[key],
            "value": val
          });
        });

        $ammount.html(data_[0].value);
        $date.html("M ha "+data_[0].key);

        var barWidth = (width - 80) / 12;

        var marginLeft = 40 + 5*barWidth,
            marginTop = radius - h/2;

        var y_scale = d3.scale.linear()
              .domain([0, d3.max(data_, function(d) { return d.value; })])
              .range([height - marginTop, marginTop*2]);

        var bar = graph.selectAll("g")
              .data(data_)
              .enter().append("g")
              .attr("transform", function(d, i) { return "translate(" + (marginLeft + i * barWidth) + "," + -marginTop + ")"; });

        bar.append("svg:rect")
              .attr("class", function(d, i) {
                if(i === 0) {
                  return "first bar"
                } else {
                  return "bar"
                }
              })
              .attr("y", function(d) { return y_scale(d.value); })
              .attr("height", function(d) { return height - y_scale(d.value); })
              .attr("width", barWidth - 1)
              .style("fill", "#FFC926")
              .style("shape-rendering", "crispEdges")
              .on("mouseover", function(d) {
                d3.selectAll(".bar").style("opacity", ".5");
                d3.select(this).style("opacity", "1");

                $ammount.html(d.value);
                $date.html("M ha "+d.key);
              });
      });
    }
  }

  return {
    show: show,
    drawCountries: drawCountries,
    drawCountry: drawCountry,
    drawForest: drawForest,
    drawTenure: drawTenure,
    drawCircle: drawCircle
  };

}());


var SubscriptionMap = (function() {

  var
  $modal   = $("#subscribe"),
  $input   = $modal.find(".input-field"),
  colors   = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'],
  zoomInit = false,
  state    = 0,
  subscribeMap,
  drawingManager,
  positionClicked,
  ppeLayer,
  worldLayer,
  selectedShapes = [],
  selectedColor;

  function clearSelection() {

    clearErrors();

    if (selectedShapes.length > 0) {
      for (var i in selectedShapes) {
        if (selectedShapes[i]) {
          selectedShapes[i].setEditable(false);
        }
      }
      selectedShapes = [];
      drawingManager.path = null;
    }

  }

  function setSelection(shape) {
    clearSelection();
    selectedShapes.push(shape);
    shape.setEditable(true);
    selectColor(shape.get('fillColor') || shape.get('strokeColor'));
  }

  function deleteSelectedShapes() {
    if (selectedShapes.length > 0) {
      for (var i in selectedShapes) {
        if (selectedShapes[i]) {
          selectedShapes[i].setMap(null);
        }
      }
      selectedShapes = [];
    }
  }

  /*
  * Changes polygon color
  * */
  function selectColor(color) {
    selectedColor = color;

    var polygonOptions = drawingManager.get('polygonOptions');
    polygonOptions.fillColor = color;
    drawingManager.set('polygonOptions', polygonOptions);
  }

  function setSelectedShapeColor(color) {
    if (selectedShapes.length > 0) {
      for (var i in selectedShapes) {
        if (selectedShapes[i].type == google.maps.drawing.OverlayType.POLYLINE) {
          selectedShapes[i].set('strokeColor', color);
        } else {
          selectedShapes[i].set('fillColor', color);
        }
      }
    }
  }

  function clearEmailErrors() {
    $input.find(".icon.error").fadeOut(250);
    $input.removeClass("error");
    $input.find(".error_input_label").fadeOut(250);
    $input.find(".error_input_label").html("");
  }

  /*
  * Removes all the errors from the subscribe window
  * */
  function clearMapErrors() {
    $modal.find(".error_box").fadeOut(250);
    $modal.find(".error_box").html("");
  }

  /*
  * Removes the errors
  * */
  function clearErrors() {
    clearEmailErrors();
    clearMapErrors();
  }

  /*
  * Builder
  * */
  function initialize() {
    clearMap();
    clearErrors();
    state = 0;
    changeToCustom();
    hideLoader();
  }

  /*
  * on remove event
  * */
  function remove() {
    clearErrors();
    deleteSelectedShapes();
    drawingManager.setOptions({ drawingControl: true });
    drawingManager.path = null;
    $modal.find(".remove").fadeOut(250);
  }

  /*
  * on submit event
  * */
  function submit() {

    clearErrors();

    var error = false;

    if (!validateEmail($input.find("input").val())) {
      $input.addClass("error");
      $input.find(".icon.error").fadeIn(250);
      $input.find(".error_input_label").html("Please enter a valid email");
      $input.find(".error_input_label").fadeIn(250);

      error = true;
    }

    if (!selectedShapes || selectedShapes.length == 0) {
      $modal.find(".error_box").html("Please, " + (state == 0 ? "draw" : "select" ) + " a polygon around the area you are interested in");
      $modal.find(".error_box").fadeIn(250);

      error = true;
    }

    if (error) return;

    // If there are no errors, let's submit the geometry

    var
    $map      = $("#subscribe_map"),
    $form     = $("#subscribe form");
    $the_geom = $form.find('#area_the_geom');

    $map.toggleClass('editing-mode');

    $the_geom.val(JSON.stringify({
      "type": "MultiPolygon",
      "coordinates": [
        $.map(selectedShapes, function(shape, index) {
          return [
            $.map(shape.getPath().getArray(), function(latlng, index) {
              return [[latlng.lng().toFixed(4), latlng.lat().toFixed(4)]];
            })
          ]
        })
      ]
    }));

    $.ajax({ type: 'POST', url: $form.attr('action'), data: $form.serialize(),

      dataType: 'json',
      success: function( data, status ){

        $form.find(".btn.create, .input-field").fadeOut(250, function() {

          $form.find(".input-field input").val("");

          $form.find(".btn.new").fadeIn(250);
          $form.find(".ok").fadeIn(250);

          $modal.find(".remove").fadeOut(250);
          deleteSelectedShapes();
          clearSelection();
        });
      }

    })

  }

  function setupZoom() {
    if (zoomInit) return ;

    var overlayID =  document.getElementById("zoom_controls_subscribe");
    // zoomIn
    var zoomInControlDiv = document.createElement('DIV');
    overlayID.appendChild(zoomInControlDiv);

    var zoomInControl = new zoomIn(zoomInControlDiv, map);
    zoomInControlDiv.index = 1;

    // zoomOut
    var zoomOutControlDiv = document.createElement('DIV');
    overlayID.appendChild(zoomOutControlDiv);

    var zoomOutControl = new zoomOut(zoomOutControlDiv, map);
    zoomOutControlDiv.index = 2;
    zoomInit = true;
  }

  function zoomIn(controlDiv, map) {
    controlDiv.setAttribute('class', 'zoom_in');

    google.maps.event.addDomListener(controlDiv, 'mousedown', function() {
      var zoom = subscribeMap.getZoom() + 1;
      if (zoom < 20) {
        subscribeMap.setZoom(zoom);
      }
    });
  }

  function zoomOut(controlDiv, map) {
    controlDiv.setAttribute('class', 'zoom_out');

    google.maps.event.addDomListener(controlDiv, 'mousedown', function() {
      var zoom = subscribeMap.getZoom() - 1;

      if (zoom > 2) {
        subscribeMap.setZoom(zoom);
      }

    });
  }

  /**
  * Setup the button bindings
  **/
  function setupBindings() {

    $modal.find(".close_icon").off("click");
    $modal.find(".close_icon").on("click", function(e) {
      e.preventDefault();
      hide();
    });

    $modal.find(".map").off("click");
    $modal.find(".map").on("click", function(e) {
      clearMapErrors();
    });

    $modal.find(".input-field").off('click');
    $modal.find(".input-field").on("click", function(e) {
      clearEmailErrors();
    });

    $modal.find("form").on("submit");
    $modal.find("form").on("submit", function(e) {
      e.preventDefault();
      e.stopPropagation();
      submit();
    });

    $modal.find('.remove').off('click');
    $modal.find('.remove').on("click", function(e){
      e.preventDefault();
      remove();
    });

    $modal.find('.btn.new').off("click");
    $modal.find('.btn.new').on("click", function(e){
      e.preventDefault();
      restart();
    });

    $modal.find('.btn.create').off("click");
    $modal.find('.btn.create').on("click", function(e){
      e.preventDefault();
      submit();
    });


    // TABS
    $modal.find(".tabs a.custom").off('click');
    $modal.find(".tabs a.custom").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      changeMapTo(0);
    });

    $modal.find(".tabs a.world").off('click');
    $modal.find(".tabs a.world").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      changeMapTo(1);
    });

    $modal.find(".tabs a.ppe").off('click');
    $modal.find(".tabs a.ppe").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      changeMapTo(2);
    });
  }

  function changeMapTo(num) {
    if (state == num) return false;

    state = num;

    clearMap();

    switch (state) {
      case 0: changeToCustom(); break;
      case 1: changeToWorld(); break;
      case 2: changeToPPE(); break;
      default: changeToCustom();
    }
  }


  function clearMap(){
    // Remove selected
    $modal.find('ul.tabs a.selected').removeClass('selected');

    // Remove common shapes
    deleteSelectedShapes();

    // Removes draw manager
    if (drawingManager) {
      google.maps.event.clearListeners(drawingManager, 'overlaycomplete')
      google.maps.event.clearListeners(drawingManager, 'drawingmode_changed')
      drawingManager.setMap(null);
      $modal.find(".remove").fadeOut(250);
    }

    // Remove PPE & World bindings
    if (subscribeMap.overlayMapTypes.getLength() > 0) {
      google.maps.event.clearListeners(subscribeMap, 'click');
      subscribeMap.overlayMapTypes.removeAt(0);
    }

    // Remove loader
    hideLoader();
  }


  function changeToCustom() {
    $modal.find('ul.tabs a.custom').addClass('selected');

    var polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.45,
      editable: true
    };

    // Creates a drawing manager attached to the map that allows the user to draw
    // markers, lines, and shapes.
    drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },

      polygonOptions: polyOptions,
      map: subscribeMap
    });

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
      if (e.type != google.maps.drawing.OverlayType.MARKER) {
        // Switch back to non-drawing mode after drawing a shape.
        drawingManager.setDrawingMode(null);
        drawingManager.path = e.overlay.getPath().getArray();

        $modal.find(".remove").fadeIn(250);
        drawingManager.setOptions({drawingControl: false});

        // Add an event listener that selects the newly-drawn shape when the user
        // mouses down on it.
        var newShape = e.overlay;
        newShape.type = e.type;
        setSelection(newShape);
      }
    });

    // Clear the current selection when the drawing mode is changed, or when the
    // map is clicked.
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
    google.maps.event.addListener(map, 'click', clearSelection);
  }

  function addWpdaSite(pa) {
    if (this.point == positionClicked && pa.the_geom) {
      // Remove old ones
      deleteSelectedShapes();

      var features = new GeoJSON(pa.the_geom, {
        strokeWeight: 2,
        strokeOpacity: 1,
        fillOpacity: 0.60,
        fillColor: "#F7B443",
        strokeColor: "#F9B33E"
      });

      for (var i in features) {
        if (features[i].length > 0) {
          for (var j in features[i]) {
            var feature = features[i][j];
            feature.setMap(subscribeMap);
            selectedShapes.push(feature);
          }
        } else {
          var feature = features[i];
          feature.setMap(subscribeMap);
          selectedShapes.push(feature);
        }
      }
    }

    hideLoader();
  }


  function changeToPPE() {
    $modal.find('ul.tabs a.ppe').addClass('selected');

    google.maps.event.addListener(subscribeMap, 'click', function(e) {
      var params = {lat:e.LatLng.lat(), lon:e.LatLng.lng()};
      var url = 'http:/wip.gfw-apis.appspot.com/wdpa/sites';

      positionClicked = e.latLng;
      showLoader();

      executeAjax(url, params, {
        success: function(sites) {
          if (sites && sites.length > 0) {
            addWpdaSite(sites[0]);
          }
        },
        error: function(e) {
          console.error('WDPA API failed', e);
          hideLoader();
        }
      });


    // Add layer
    ppeLayer = new google.maps.ImageMapType({
      getTileUrl: function(coord, zoom) {
      },
      tileSize: new google.maps.Size(256, 256),
      isPng: true,
      maxZoom: 21,
      name: 'ppe',
      alt: "Protected Planet"
    });
    subscribeMap.overlayMapTypes.insertAt(0, ppeLayer);
  });
}


  function changeToWorld() {
    $modal.find('ul.tabs a.world').addClass('selected');

    google.maps.event.addListener(subscribeMap, 'click', function(e) {
      positionClicked = e.latLng;
      showLoader();

      $.ajax({
        url: 'http://wri-01.cartodb.com/api/v2/sql?format=geojson&q=SELECT name,the_geom FROM world_countries WHERE ST_Intersects(the_geom,ST_SetSRID(ST_Makepoint(' + e.latLng.lng() + ',' + e.latLng.lat() + '),4326)) LIMIT 1',
        dataType: 'jsonp',
        feature: e.latLng,
        success: function(r) {
          if (this.feature == positionClicked && r.features && r.features.length > 0) {
            // Remove old ones
            deleteSelectedShapes();

            var features = new GeoJSON(r, {
              strokeWeight: 2,
              strokeOpacity: 1,
              fillOpacity: 0.60,
              fillColor: "#F7B443",
              strokeColor: "#F9B33E"
            });

            for (var i in features) {
              if (features[i].length > 0) {
                for (var j in features[i]) {
                  var feature = features[i][j];
                  feature.setMap(subscribeMap);
                  selectedShapes.push(feature);
                }
              } else {
                var feature = features[i].setMap(subscribeMap)
                selectedShapes.push(feature);
              }
            }
          }

          hideLoader();
        },
        error: function(e) {
          hideLoader();
          console.log(e);
        }
      });
    });

    // Add layer
    worldLayer = new google.maps.ImageMapType({
      getTileUrl: function(coord, zoom) {
        return "http://dyynnn89u7nkm.cloudfront.net/tiles/world_countries/" + zoom + "/" + coord.x + "/" + coord.y + ".png?v=16";
      },
      tileSize: new google.maps.Size(256, 256),
      isPng: true,
      maxZoom: 21,
      name: 'world',
      alt: "CartoDB world layer"
    });
    subscribeMap.overlayMapTypes.insertAt(0, worldLayer);
  }

  function showLoader() {
    $modal.find("#loader_subscribe").fadeIn(250);
  }

  function hideLoader() {
    $modal.find("#loader_subscribe").fadeOut(250);
  }


  function hide() {
    $(".backdrop").fadeOut(250);

    $modal.fadeOut(250, function() {
      clearErrors();
      $input.find("input").val("");
      clearSelection();
    });
  }

  function restart() {
    var $form     = $("#subscribe form");
    $form.find(".ok").fadeOut(250);
    $modal.find(".remove").fadeOut(250);
    $form.find(".btn.new").fadeOut(250);
    $form.find(".btn.create").fadeIn(250);
    $form.find(".input-field input").val("");
    $form.find(".input-field").fadeIn(250);
    deleteSelectedShapes();
    clearSelection();
  }

  function show() {

    $modal.find(".ok").hide();
    $modal.find(".btn.create").show();
    $modal.find(".input-field").show();
    $modal.find(".btn.new").hide();
    $modal.find(".remove").hide();

    $(".backdrop").fadeIn(250, function() {

      var $map = $("#subscribe_map");

      $modal.css({ opacity: '0', display: 'block' });
      $modal.stop().animate({opacity: '1'}, 250, function(){

        var mapOptions = {
          zoom:               1,
          minZoom:            config.MINZOOM,
          maxZoom:            config.MAXZOOM,
          center:             new google.maps.LatLng(32.39851580247402, -35.859375),
          mapTypeId:          google.maps.MapTypeId.TERRAIN,
          disableDefaultUI:   true,
          panControl:         false,
          zoomControl:        false,
          mapTypeControl:     false,
          scaleControl:       false,
          streetViewControl:  false,
          overviewMapControl: false,
          scrollwheel:        false
        };

        // Initialise the google map
        subscribeMap = new google.maps.Map(document.getElementById("subscribe_map"), mapOptions);
        initialize();

        setupBindings();
        setupZoom();

      });
    });
  }

  return {
    show: show,
    remove: remove,
    submit: submit,
    clearEmailErrors: clearEmailErrors,
    clearMapErrors: clearMapErrors
  };

}());



var Navigation = (function() {

  function _select(name) {
    $(".navbar li a").removeClass("selected");
    $(".navbar ." + name).addClass("selected");
  }

  var lastCountryClass;
  if ($('body').find("#countries").length>0) {
    $.ajax({
      async: true,
      dataType: "jsonp",
      jsonpCallback:'iwcallback',
      url: "http://wri-01.cartodb.com/api/v2/sql?q=SELECT sum(alerts) as alerts, iso FROM gfw2_forma_graphs WHERE date > (SELECT n  FROM gfw2_forma_datecode WHERE now() -INTERVAL '6 months' < date ORDER BY date ASC LIMIT 1) group by iso;",
      success: function(data) {
        for (var i = 0; i<data.rows.length; i++){
          $("#countries ."+data.rows[i].iso+" .content strong").html(data.rows[i].alerts);
        }
      }
    });
  }
  $("#countries .disabled").on("mouseenter", function() {
    $(".select").hide();
  });

  $("#countries h1").on("mouseenter", function() {
    $(".select").hide();
  });

  $("#countries").on("mouseleave", function() {
    $(".select").hide();
  });

  $("#countries .country").on("mouseenter", function() {

    if ($(this).hasClass("disabled")) {
      return;
    }

    var // selection box dimensions
    h = $("#countries .select").height(),
    w = $("#countries .select").width();

    var top = $(this).position().top - (h/2 - $(this).height()/2);
    var left = $(this).position().left - (w/2 - $(this).width()/2);

    $("#countries .select").css({ top: top , left: left });
    var c = $(this).attr("class").replace(/country/, "");

    if (lastCountryClass) {
      $("#countries .select").removeClass(lastCountryClass);
    }

    $("#countries .select").addClass(c);
    lastCountryClass = c;
    $("#countries .select").html($(this).html());
    $("#countries .select").show();
  });

  function _showState(state) {
    state == 'home' ?  _showHomeState() : _showMapState();
  }

  function _showHomeState() {

    google.maps.event.addListenerOnce(map, 'dragend', function (ev) {
      Navigation.showState("map");
    });

    showMap = false;

    _hideOverlays();

    legend.hide();
    analysis.hide();
    analysis.button.hide();
    layerSelector.hide();
    searchBox.hide();

    $("#zoom_controls").hide();
    $("#viewfinder").hide();

    Navigation.select("home");

    Filter.hide(function() {
      if (wall.readCookie("pass") == 'ok') {
        $("header").animate({ height: "230px" }, 250, function() {
          $("hgroup .title").show();
          $("hgroup .title").animate({ top: 29, opacity: 1 }, 250);
        }).removeClass("stuck");

        $(".big_numbers").fadeIn(250);
      } else {
        $("hgroup .title").hide();
        $("hgroup .splash_title").show();

        $(".navbar").hide();
        $(".signin").show();

        $(".big_numbers").hide();
      }
    });

    Timeline.hide();

    if (this.time_layer) {
      this.time_layer.cache_time(true);
      this.time_layer.set_time(128);
    }

    TimelineNotPlayer.hide();

    if (this.time_layer_notplayer) {
      this.time_layer_notplayer.cache_time(true);
      this.time_layer_notplayer.set_time(128);
    }

    TimelineImazon.hide();

    if (this.time_layer_imazon) {
      this.time_layer_imazon.cache_time(true);
      this.time_layer_imazon.set_time(128);
    }

    if (GFW && GFW.app) {
      GFW.app.close(function() {
        Circle.show(250);
      });
    }
  }

  function _showMapState() {

    showMap = true;

    _hideOverlays();

    Navigation.select("map");

    Circle.hide();

    layerSelector.show();
    legend.show();

    analysis.show();
    analysis.button.show();

    searchBox.show();

    $("#zoom_controls").show();
    $("#viewfinder").show();

    if (this.time_layer) this.time_layer.set_time(self.time_layer.cache_time());

    if(GFW.app.currentBaseLayer && GFW.app.currentBaseLayer === "semi_monthly") {
      Timeline.show();
    } else if(GFW.app.currentBaseLayer && GFW.app.currentBaseLayer === "quarterly") {
      TimelineNotPlayer.show();
    }

    if (wall.readCookie("pass") == 'ok') {
      $(".big_numbers").fadeOut(250);

      $("header").animate({height: "135px"}, 250, function() {
        if (GFW.app) GFW.app.open();
      }).addClass("stuck");

      $("hgroup .title").animate({ top: "50px", opacity: 0 }, 250, function() {
        $("hgroup .title").hide();

        Filter.show();

        $(".big_numbers").fadeOut(250);
      });

      // Firefox hack to show the unload layers
      if (config.pendingLayers.length > 0) {
        _.each(config.pendingLayers, function(layer) {{
          GFW.app._loadLayer(layer);
        }});

        config.pendingLayers = [];
      }

      Filter.show();
    } else {
      $("hgroup .title").hide();
      $("hgroup .splash_title").show();

      $(".navbar").hide();
      $(".signin").show();

      $(".big_numbers").hide();
    }
  }

  function _hideOverlays() {
    $("#subscribe").fadeOut(250);
    $("#share").fadeOut(250);
    $(".backdrop").fadeOut(250);
    $("#countries").fadeOut(250);
    $(".countries_backdrop").fadeOut(250);
  }

  // Init method
  $(function() {
    $(document).on("click", ".radio", function(e) {
      e.preventDefault();
      e.stopPropagation();

      $('.radio[data-name="' + $(this).attr('data-name') + '"]').removeClass("checked");
      $(this).addClass("checked");
    });

    $(document).on("click", ".checkbox:not(.disabled)", function(e) {
      e.preventDefault();
      e.stopPropagation();

      $(this).toggleClass("checked");

      if ($(this).hasClass("checked")) {
        var color = $(this).attr("data-color");
        $(this).css("color", color );
        $(this).find("i").css("background-color", color );
      } else {
        $(this).css("color", "#ccc");
        $(this).find("i").css("background-color", "#ccc");
      }

    });
  }());

  return {
    select: _select,
    showState: _showState,
    hideOverlays: _hideOverlays
  };

}());

var Filter = (function() {

  var
  scrollPane,
  pids,
  filters    = [],
  lastClass  =  null,
  categories = [],
  $filters   = $(".filters"),
  $advance   = $filters.find(".advance"),
  $layer     = $("#layer");

  function _updateHash() {

    var zoom = map.getZoom();
    var lat  = map.getCenter().lat().toFixed(2);
    var lng  = map.getCenter().lng().toFixed(2);

    var hash = "map/" + zoom + "/" + lat + "/" + lng + "/" + config.iso + "/" + filters.join(",");
    window.router.navigate(hash, { replace: true, trigger: true });
  }

  function _toggle(id) {
    if(_.include(filters, id)) {
      filters = _.without(filters, id);
    } else {
      filters.push(id);
    }

    config.mapOptions.layers = filters;

    _updateHash();
  }

  function _toggleBiome(id) {
    var checkbox = $(".checkbox.forest_change");

    this.toggle(id);

    if(checkbox.hasClass("checked")) {
      $(checkbox).css("color", "#ccc");
      $(checkbox).find("i").css("background-color", "#ccc");
      $(checkbox).removeClass("checked");
    }
  }

  function _disableBiome() {
    $(".checkbox.forest_change").addClass("disabled").closest("li").addClass("disabled");
  }

  function _enableBiome() {
    $(".checkbox.forest_change").removeClass("disabled").closest("li").removeClass("disabled");
  }

  function _show(callback) {

    if (!$filters.hasClass("hide")) return;

    var count = categories.length;

    $filters.fadeIn(150, function() {

      $filters.find("li").slice(0, count).each(function(i, el) {
        $(el).delay(i * 50).animate({ opacity: 1 }, 150, "easeInExpo", function() {
          $(this).find("a").animate({ top: "-15px"}, 150);
          count--;

          if (count <= 0) {

            if (categories.length > 7) { // TODO: calc this number dynamically
              $advance.delay(200).animate({ top: "20px", opacity: 1 }, 200);
            }

            $filters.removeClass("hide");

            $filters.find("li").css({opacity:1});
            $filters.find("li a").css({top:"-15px"});

            if (callback) callback();
            _calcFiltersPosition();
          }
        });
      });
    });
  }

  function _hide(callback) {

    _hideLayer();

    if ($filters.hasClass("hide")) {
      callback && callback();
      return;
    }

    var count = categories.length;

    $advance.animate({ top: "40px", opacity: 0 }, 200, function() {

      $($filters.find("li a").slice(0, count).get().reverse()).each(function(i, el) {

        $(el).delay(i * 50).animate({ top: "15px" }, 150, function() {
          $(this).parent().animate({ opacity: "0"}, 150, function() {

            --count;

            if (count <= 0) {
              $filters.fadeOut(150, function() {
                $filters.addClass("hide");

                $filters.find("li a").css({top:"15px"});
                $filters.find("li").css({opacity:0});

                if (callback) callback();
              });
            }
          });
        });
      });
    });
  }

  function _calcFiltersPosition() {
    $filters.find("li").each(function(i, el) {
      $(el).data("left-pos", $(el).offset().left);
    });
  }

  function _advanceFilter(e) {
    e.preventDefault();

    _closeOpenFilter();

    var
    $inner = $filters.find(".inner"),
    $el    = $inner.find("li:first"),
    width  = $el.width() + 1;

    $filters.find(".inner").animate({ left:"-=" + width }, 250, "easeInExpo", function() {
      $(this).find('li:last').after($el);
      $(this).css("left", 0);

      _calcFiltersPosition();
    });
  }

  function _hideLayer() {
    $layer.animate({ opacity: 0 }, 70, function() {
      $layer.css("left", -10000);
    });
  }

  function _closeOpenFilter() {
    var c = $layer.attr("class");

    if (c === undefined) return;

    clearTimeout(pids);

    pids = setTimeout(function() {
      _close(c);
    }, 100);
  }

  function _close(c) {
    $layer.animate({ opacity: 0 }, 70, function() {
      $layer.css("left", -10000);
      $layer.removeClass(c);
    });
  }

  function _open() {

    var
    $li          = $(this),
    lw           = $layer.width(),
    liClass      = $li.attr("data-id"),
    l            = $li.data("left-pos"),
    $line        = $li.find(".line"),
    lineWidth    = $line.width();

    cancelClose();

    $layer.removeClass(lastClass);

    var name = $li.find("a").text();
    $layer.find("a.title").text(name);
    var color = $li.find("a").css("color");

    $layer.find("a.title").css({ color: color });
    $layer.find(".line").css({ backgroundColor: color });

    $layer.find(".links li.last").removeClass('last');
    $layer.find(".links li").hide();
    $layer.find(".links li." + liClass).show();
    $layer.find(".links li." + liClass).last().addClass("last");



    $layer.find(".source").off("click");
    $layer.find(".source").on("click", function(e) {
      e.preventDefault();

      var source = $(e.target).attr("data-slug");

      sourceWindow.show(source).addScroll();
    });



    $layer.addClass(liClass);

    lastClass = liClass;

    var
    width  = $li.width() < 170 ? 170 : $li.width(),
    left   = (l + $li.width() / 2) - (width / 2),
    height = $layer.find(".links").height();

    $layer.find("li").css({ width:width - 20});
    $layer.css({ left: left, width:width, top: -80});

    $layer.animate({ opacity: 1 }, 250);

    $(".scroll").css({ height: $layer.find(".links").height() });

    // if (scrollPane) {
    //   scrollPane.reinitialise();
    // } else {
    //   $pane.jScrollPane( { showArrows: true });
    //   scrollPane = $pane.data('jsp');
    // }
    // window.scrollPane = scrollPane;

  }

  function cancelClose() {
    clearTimeout(pids);
  }

  function _onMouseEnter() {
    $layer.animate({ opacity: 1 }, 150);
  }


  function _nothing() {

  }

  function _init() {

    // Bindings
    $(document).on("click", ".filters .advance", _advanceFilter);
    $(document).on("mouseenter", ".filters li", _open);
    $layer.on("mouseleave", _closeOpenFilter);
  }

  function _check(id) {
    $("#layer a[data-id=" + id +"]").addClass("checked");
    var color = $("#layer a[data-id=" + id +"]").attr("data-color");
    $("#layer a[data-id=" + id +"]").css("color", color );
    $("#layer a[data-id=" + id +"]").find("i").css("background-color", color );

    filters.push(id);
  }

  function _fakeCheck(id) {
    filters.push(id);
  }

  function _addFilter(id, slug, category, name, options) {

    var
    clickEvent  = options.clickEvent  || null,
    disabled    = options.disabled    || false;
    source      = options.source      || null;
    category_color = options.category_color || "#ccc";
    color       = options.color       || "#ccc";

    if (category === null || !category) {
      category = 'Protected Areas';
    }

    var cat  = category.replace(/ /g, "_").toLowerCase();

    if (!_.include(categories, cat)) {
      var
      template = _.template($("#filter-template").html()),
      $filter  = $(template({ name: category, category: cat, data: cat, category_color: category_color }));

      $filters.find("ul").append($filter);
      categories.push(cat);
    }

    var
    layerItemTemplate = null,
    $layerItem        = null;

    if (!disabled) { // click binding
      // Select the kind of input (radio or checkbox) depending on the category
      if (cat === 'forest_change' && slug != 'biome') {
        layerItemTemplate = _.template($("#layer-item-radio-template").html());
        $layerItem = $(layerItemTemplate({ name: name, id: id, slug:slug, category: cat, disabled: disabled, source: source }));

        $layerItem.find("a:not(.source)").on("click", function() {
          if (!$(this).find(".radio").hasClass("checked")) {
            clickEvent && clickEvent();
          }
        });
      } else {
        layerItemTemplate = _.template($("#layer-item-checkbox-template").html());
        $layerItem = $(layerItemTemplate({ name: name, id: id, color: color, slug:slug, category: cat, disabled: disabled, source: source }));

        $layerItem.find("a:not(.source)").on("click", function() {
          clickEvent();
        });
      }
    } else {
      layerItemTemplate = _.template($("#layer-item-disabled-template").html());
      $layerItem = $(layerItemTemplate({ name: name, id: id, color: color, slug:slug, category: cat, disabled: disabled, source: source }));

      $layerItem.find("a:not(.source)").on("click", function(e) {
        preventDefault();
      });
    }

    $layer.find(".links").append($layerItem);
    $layerItem.find(".checkbox").addClass(cat);

    // We select the FORMA layer by default
    if ( slug == "semi_monthly" ) {
      $layerItem.find(".radio").addClass('checked');
    }
  }

  return {
    init: _init,
    show: _show,
    hide: _hide,
    addFilter: _addFilter,
    toggle: _toggle,
    toggleBiome: _toggleBiome,
    disableBiome: _disableBiome,
    enableBiome: _enableBiome,
    closeOpenFilter:_closeOpenFilter,
    calcFiltersPosition: _calcFiltersPosition,
    check: _check,
    fakeCheck: _fakeCheck
  };

}());

var Circle = (function() {

  var template, $circle, $title, $counter, $background, $explore, animating = true, animatingB = false, circlePID;

  function toggleData() {
    var data = {};

    if ($icon.hasClass("area")) {
      data = flagSummary;
      $icon.removeClass("area");
    } else {
      data = areaSummary;
      $icon.removeClass("flag");
    }

    $icon.addClass(data.icon);
    $title.html(data.title);
    $counter.html(data.count);

  }

  function _build(){

    if ( $("#circle-template").length > 0 ) {

      template    = _.template($("#circle-template").html());
      $circle     = $(template(flagSummary));

      $title      = $circle.find(".title");
      $icon       = $circle.find(".icon");
      $counter    = $circle.find(".counter");
      $background = $circle.find(".background");
      $explore    = $circle.find(".explore");

      $("#map").append($circle);

      circlePID = _startAnimation();

      return true;
    }

    return false;
  }

  function _startAnimation() {
    return setInterval(function() {
      _next();
    }, 5000);
  }

  function _next() {

    if (animatingB) return;
    animatingB = true;

    $icon.animate({ backgroundSize: "10%", opacity: 0 }, 250, "easeOutExpo", function() {
      $circle.delay(200).animate({ marginLeft: -350, opacity: 0 }, 350, "easeOutQuad", function() {
        $circle.css({marginLeft: 100 });
        $circle.delay(400).animate({ marginLeft: -1*318/2, opacity: 1 }, 250, "easeOutQuad", function() {
          $icon.animate({ backgroundSize: "100%", opacity: 1 }, 250, "easeInExpo");
          animatingB = false;
        });
      });
    });

  }

  function _show(delay) {

    if (!delay) {
      delay = 0;
    }

    var $circle = $(".circle");

    $circle.show();

    $circle.delay(delay).animate({ top:'50%', marginTop:-1*($circle.height() / 2), opacity: 1 }, 250, function() {
      $title.animate({ opacity: 0.75 }, 150, "easeInExpo");

      $icon.animate({ backgroundSize: "100%", opacity: 1 }, 350, "easeInExpo");

      $counter.animate({ opacity: 1 }, 150, "easeInExpo");
      animating = false;

      _onMouseLeave();

    });
  }

  function _onMouseEnter() {

    clearInterval(circlePID);
    if (animating) return;

    var $circle = $(".circle");

    $circle.find(".title, .counter").stop().animate({ opacity: 0 }, 100, "easeInExpo", function() {
      $circle.find(".explore, .background").stop().animate({ opacity: 1 }, 100, "easeOutExpo");
      $icon.stop().animate({ backgroundSize: "10%", opacity: 0 }, 200, "easeInExpo");
      $circle.addClass("selected");
    });
  }

  function _onMouseLeave() {

    clearInterval(circlePID);
    circlePID = _startAnimation();

    if (animating) return;

    $circle.find(".explore, .background").stop().animate({ opacity: 0 }, 100, "easeOutExpo", function(){
      $title.animate({ opacity: 0.75 }, 100, "easeOutExpo");
      $counter.animate({ opacity: 1 }, 100, "easeOutExpo");
      $icon.stop().animate({ backgroundSize: "100%", opacity: 1 }, 200, "easeOutExpo");
      $circle.removeClass("selected");
    });
  }

  function _hide(e) {
    if (e) {
      e.preventDefault();
    }

    animating = true;

    var _afterHide = function() {
      $circle.animate({ marginTop:0, opacity: 0 }, 250, function() {
        $(this).hide();
      });
    };

    if ($circle) {
      $circle.find(".title, .counter").animate({ opacity: 0 }, 150, "easeOutExpo", _afterHide);
    }
  }

  function _onClick(e) {
    e && e.preventDefault();
    e && e.stopPropagation();

    window.router.navigate("map", { trigger: true });
  }

  function _init() {
    if (_build()) {

      // Bindings
      $circle.die("click");
      $circle.die("mouseenter");
      $circle.die("mouseleave");

      $circle.on("click", _onClick);
      $circle.on("mouseenter", _onMouseEnter);
      $circle.on("mouseleave", _onMouseLeave);

    }
  }

  return {
    init: _init,
    show: _show,
    hide: _hide
  };

})();

function addCircle(id, type, options) {

  var
  countryCode       = options.countryCode || 'MYS',
  width             = options.width      || 310,
  height            = options.height     || width,
  barWidth          = options.barWidth   || 5,
  title             = options.title      || "",
  subtitle          = options.subtitle   || "",
  legend            = options.legend     || "",
  h                 = 100, // maxHeight
  legendUnit        = options.legendUnit || "",
  unit              = options.unit       || "",
  color             = options.color      || "#333333",
  hoverColor        = options.hoverColor || "#111111",
  radius            = width / 2,
  mouseOverDuration = 10,
  mouseOutDuration  = 700;
  formaDownloadURL   = 'http://gfw_downloads_iso.s3.amazonaws.com/' + countryCode + '.zip';

  var graph = d3.select(".lines." + type)
  .append("svg:svg")
  .attr("class", id)
  .attr("width", width)
  .attr("height", height);

  var dashedLines = [
    { x1:45, y:height/4,   x2:270,   color: "#ccc" },
    { x1:2,  y:height/2,   x2:width, color: "#ccc" },
    { x1:45, y:3*height/4, x2:270,   color: "#ccc" }
  ];

  // Adds the dotted lines
  _.each(dashedLines, function(line) {
    graph.append("svg:line")
    .attr("x1", line.x1)
    .attr("y1", line.y)
    .attr("x2", line.x2)
    .attr("y2", line.y)
    .style("stroke-dasharray", "2,2")
    .style("stroke", line.color);
  });

  // Internal circle
  graph.append("circle")
  .attr("width", width)
  .attr("height", height)
  .style("stroke", color)
  .attr("r", function(d) { return radius - 15.5; })
  .attr("transform", "translate(" + radius + "," + radius + ")");

  // External circle
  graph.append("circle")
  .attr("width", width)
  .attr("height", height)
  .style("stroke", "white")
  .attr("r", function(d) { return radius - 5.5; })
  .attr("transform", "translate(" + radius + "," + radius + ")")
  .on("mouseout", function(d) {
  });

  function addText(opt) {
    $(".lines ." + opt.c).find("span").html(opt.html);
  }

  // Content selection: lines or bars
  if (type == 'lines') {

    $.ajax({
      async: true,
      dataType: "jsonp",
      url: "https://wri-01.cartodb.com/api/v2/sql?q=SELECT date_part('year',gfw2_forma_datecode.date) as y, date_part('month',gfw2_forma_datecode.date) as m,alerts FROM gfw2_forma_graphs,gfw2_forma_datecode WHERE  71<gfw2_forma_datecode.n AND gfw2_forma_datecode.n = gfw2_forma_graphs.date AND iso = '" + countryCode + "' order by gfw2_forma_datecode.date asc",
      success: function(json) {

        var data = json.rows.slice(1, json.rows.length);

        if (data.length === 0) {
          $(".lines .coming_soon").show();

          return;
        }

        $(".lines").removeClass("ghost");

        var x = d3.scale.linear()
        .domain([0, data.length - 1])
        .range([0, width - 80]);

        var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d.alerts})])
        .range([0, h]);

        var line = d3.svg.line()
        .x(function(d,i)  { return x(i); })
        .y(function(d, i) { return h-y(d.alerts); })
        .interpolate("basis");

        // Adds the line graph
        var marginLeft = 40;
        var marginTop = radius - h/2;

        var val = "<span>" + data[0].alerts + "</span> <small>" + unit + "</small>";
        $(".lines .graph-amount").html(val);

        var date = new Date(data[0].y, data[0].m);
        months = monthDiff(date, new Date());

        if (months === 0) {
          val = "in this month";
        } else if (months == 1) {
          val = "in the last month";
        } else {
          val = "in " + config.MONTHNAMES[data[0].m - 1] + " " + data[0].y;
        }

        $(".lines .date").html(val);

        var p = graph.append("svg:path")
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .attr("d", line(data))
        .on("mousemove", function(d) {


          var index = Math.round(x.invert(d3.mouse(this)[0]));

          if (data[index]) { // if there's data
            var val = "<span>" + data[index].alerts + "</span> <small>" + unit + "</small>";
            $(".lines .graph-amount").html(val);

            var date = new Date(data[index].y, data[index].m);
            months = monthDiff(date, new Date());

            if (months === 0) {
              val = "in this month";
            } else if (months == 1) {
              val = "in the last month";
            } else {
              val = "in " + config.MONTHNAMES[data[index].m - 1] + " " + data[index].y;
            }

            $(".lines .date").html(val);

            d3.select(this).transition().duration(mouseOverDuration).style("fill", hoverColor);

            var cx = d3.mouse(this)[0]+marginLeft;
            var cy = h-y(data[index].alerts)+marginTop;

            graph.select("#marker")
            .attr("cx",cx)
            .attr("cy",cy)
          }
        })

        graph.append("circle")
        .attr("id", "marker")
        .attr("cx", -10000)
        .attr("cy",100)
        .attr("r", 5);
      }
    });


  } else if (type == 'bars') {

    $.ajax({
      async: true,
      dataType: "jsonp",
      url: "https://wri-01.cartodb.com/api/v2/sql?q=SELECT area_sqkm,height_m FROM gfw2_forest_heights WHERE iso = '"+ countryCode +"' ORDER BY height_m ASC",
      success: function(json) {

        var data = json.rows;

        var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, barWidth]);

        var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d.area_sqkm})])
        .rangeRound([0, h]); //rangeRound is used for antialiasing

        var marginLeft = width/2 - data.length * barWidth/2;
        var marginTop = height/2 - h/2;

        graph.selectAll("rect")
        .data(data).enter()
        .append("rect")
        .attr("x", function(d, i) { return x(i) - .5; })
        .attr("y", function(d) {
          var l = y(d.area_sqkm);
          if (l<3) l = 3;
          return h - l - .3; }
        )
        .attr("width", barWidth)
        .attr("height", function(d) {
          var l = y(d.area_sqkm);
          if (l<3) l = 3;
          return l; }
        )
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .on("mouseover", function(d) {

          var val = "<span>" + Math.floor(d.area_sqkm) + "</span> <small>" + unit + "</small>";
          $(".amount." + id + " .text").html(val);

          var t = _.template(legend);
          val = t({ n: Math.floor(d.height_m) + legendUnit });
          $(".graph_legend." + id + " .text").html(val);

          d3.select(this).transition().duration(mouseOverDuration).style("fill", hoverColor);
        })
        .on("mouseout", function() { d3.select(this).transition().duration(mouseOutDuration).style("fill", color); })
      }
    });

  }

  // Adds texts

  if (title) {
    addText({ x: 0, y: 40, width: width, height: 50, c:"title", html: title });
  }

  if (subtitle) {
    addText({ x: 0, y: height/4 - 10, width: width, height: 50, c:"subtitle", html: subtitle });
  }

  // Hook up the FORMA download URL (zipped up Shapefile):
  $('.lines a.action').attr('href', formaDownloadURL);
}

