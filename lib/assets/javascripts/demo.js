showMap = false;

function addCircle(id, chartID, type, options) {

  var
  width             = options.width      || 300,
  height            = options.height     || width,
  barWidth          = options.barWidth   || 5,
  title             = options.title      || "",
  subtitle          = options.subtitle   || "",
  legend            = options.legend     || "",
  h                 = 100, // maxHeight
  unit              = options.unit       || "",
  color             = options.color      || "#75ADB5",
  hoverColor        = options.hoverColor || "#427C8D",
  radius            = width / 2,
  mouseOverDuration = 10,
  mouseOutDuration  = 700;

  var graph = d3.select(".circle." + type)
  .append("svg:svg")
  .attr("class", id)
  .attr("width", width)
  .attr("height", height);

  var dashedLines = [
    { x1:45, y:height/4,   x2:270,   color: "#ccc" },
    { x1:2,  y:height/2,   x2:width, color: color },
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
  .attr("transform", "translate(" + radius + "," + radius + ")");

  function addText(opt) {
    //if (typeof SVGForeignObjectElement !== 'undefined')  {
      //graph.append("svg:foreignObject")
      //.attr('x', opt.x)
      //.attr('y', opt.y)
      //.attr('width', opt.width)
      //.attr('height', opt.height)
      //.attr('class', opt.c)
      //.append("xhtml:div")
      //.html(opt.html);
    //}
     //else {
     var $div = $('<div class="texto '+opt.c+'">'+opt.html+'</div>');
     $div.css({position:"absolute", top: opt.x, top:opt.y, "pointer-events":"none", width: width, height: height });
     $("#"+chartID).append($div);

     //}
  }


  // Content selection: lines or bars
  if (type == 'lines') {

    $.ajax({
      async: true,
      dataType: "jsonp",
      url: "https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20date_part('year',gfw2_forma_datecode.date)%20as%20y,%20date_part('month',gfw2_forma_datecode.date)%20as%20m,alerts%20FROM%20gfw2_forma_graphs,gfw2_forma_datecode%20WHERE%20gfw2_forma_datecode.n%20=%20gfw2_forma_graphs.date%20AND%20iso%20=%20'MYS'%20order%20by%20gfw2_forma_datecode.date%20asc",
      success: function(json) {

      var data = json.rows.slice(1,json.rows.length);

      var x = d3.scale.linear()
      .domain([0, data.length - 1])
      .range([0, width - 35]);

      var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) {return d.alerts})])
      .range([0, h]);

      var line = d3.svg.line()
      .x(function(d,i)  { return x(i); })
      .y(function(d, i) { return h-y(d.alerts); })
      .interpolate("basis");

      // Adds the line graph
      var marginLeft = 20;
      var marginTop = radius - h/2;

      var p = graph.append("svg:path")
      .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
      .attr("d", line(data))
			.on("mousemove", function(d) {
				var index = Math.round(x.invert(d3.mouse(this)[0]));
				console.log("Index value: "+index+", date: "+data[index].y+"/"+data[index].m+", alert number: "+data[index].alerts);

				var cx = d3.mouse(this)[0]+marginLeft;
				var cy = h-y(data[index].alerts)+marginTop;

				graph.select("#marker")
					.attr("cx",cx)
					.attr("cy",cy)
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
      url: "https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20area_sqkm,height_m%20FROM%20gfw2_forest_heights%20WHERE%20iso%20=%20'CMR'%20ORDER%20BY%20height_m%20ASC",
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
                  var val = Math.floor(d.area_sqkm) + " " + unit;
                  $("#" + chartID + " .amount." + id + " .text").text(val);
                  console.log("#" + chartID + " .amount." + id + " .text");
                  d3.select(this).transition().duration(mouseOverDuration).style("fill", hoverColor);
                })
                .on("mouseout", function() { d3.select(this).transition().duration(mouseOutDuration).style("fill", color); })
                }
    });

  }

  // Adds texts

  if (title) {
    addText({ x: 0, y: 40, width: width, height: 50, c:"title", html: '<div class="text">' + title + '</div>' });
  }

  if (subtitle) {
    addText({ x: 0, y: height/4 - 10, width: width, height: 50, c:"subtitle", html: '<div class="text">' + subtitle + '</div>' });
  }

  addText({ x: 0, y: 3*height/4 - 13, width: width, height: 50, c:"amount " + id, html: '<div class="text">0</div>' });

  if (legend) {
    addText({ x: 0, y: 3*height/4 + 15, width: width, height: 50, c:"legend", html: '<div class="text">' + legend + '</div>' });
  }
}

  var
  renderPolygonListener = null,
  polygon               = null,
  polygonPath           = [];

  var subscribeMap;

$(".subscribe").on("click", function(e) {
  e.preventDefault();

  $("#content").append('<div class="backdrop" />');
  $(".backdrop").fadeIn(250, function() {

    var $map = $("#subscribe").find(".map");

    $("#subscribe").center();
    $("#subscribe").fadeIn(250, function() {

      // Initialise the google map
      subscribeMap = new google.maps.Map(document.getElementById("subscribe_map"), config.mapOptions);
      initDrawingMode(subscribeMap, $map);

    });
  });

});

$('#subscribe .remove').on("click", function(e){
  e.preventDefault();

    var $map = $("#subscribe").find(".map");
    polygon.setMap(null);
    polygonPath = [];
  renderPolygonListener = null,
    initDrawingMode(subscribeMap, $map);
});

    $('#subscribe .btn').on("click", function(e){
      e.preventDefault();

      var $map  = $("#subscribe .map");
      var $form = $("#subscribe form");
      var $the_geom = $form.find('#area_the_geom');

      $map.toggleClass('editing-mode');
      $the_geom.val(JSON.stringify({
        "type": "MultiPolygon",
        "coordinates": [
          [
            $.map(polygonPath, function(latlong, index) {
              return [[latlong.lng(), latlong.lat()]];
            })
          ]
        ]
      }));

      $.post($form.attr('action'), $form.serialize(), function(response){
        google.maps.event.removeListener(renderPolygonListener);
        renderPolygonListener = null;
      });

    });

function initDrawingMode(map, $map) {

  $map.toggleClass('editing-mode');

  map.setOptions({draggableCursor:'crosshair'});

  if (renderPolygonListener) return;

  polygonPath = [];

  polygon = new google.maps.Polygon({
    paths: [],
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });

  polygon.setMap(map);

  renderPolygonListener = google.maps.event.addListener(map, 'click', function(e){
    polygonPath.push(e.latLng);
    polygon.setPath(polygonPath);
  });
}

addCircle("forma",  "c1", "lines", { width: 300, title: "Height", subtitle:"Tree height distribution", legend:"total forest area", hoverColor: "#427C8D", color: "#F2B357", unit: "Ha" });
addCircle("tree",   "c2", "bars",  { width: 300, title: "Height", subtitle:"Tree height distribution", legend:"total forest area", hoverColor: "#427C8D", color: "#75ADB5", unit: "Ha" });
addCircle("forest", "c3", "bars",  { width: 300, title: "Height", subtitle:"Tree height distribution", legend:"total forest area", hoverColor: "#427C8D", color: "#75ADB5", unit: "Be" });
