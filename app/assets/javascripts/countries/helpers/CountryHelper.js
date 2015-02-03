define([
  'd3',
  'topojson',
  'geojsonArea',
  'countries/helpers/CountryConfig'
], function(d3, topojson, geojsonArea, config) {

  var CountryHelper = {
    config: config,

    draw: function(topology, c, iso, options) {
      var country = topojson.feature(topology, topology.objects[c]);

      var width = 300,
          height = 300,
          el = "#"+iso;

      if (!options.alerts) {
        width = 150;
        height = 150;
        el = el+" a";
      }

      var svg = d3.select(el).append("svg:svg")
        .attr("width", width)
        .attr("height", height);

      var projection = d3.geo.mercator().scale(1).translate([0, 0]);
      var path = d3.geo.path().projection(projection);

      var b = path.bounds((options && options.bounds) || country),
          s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
          t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

      projection
        .scale(s)
        .translate(t);

      svg.append("svg:path")
        .data([country])
        .attr("d", path)
        .attr("class", (options && options.bounds) ? 'country_alt' : 'country_main');

      if (options && options.alerts) {
        var forest = [];

        for(var i = 1; i < Object.keys(topology.objects).length; i++) {
          if (topology.objects[i].type === "Point") {
            forest.push(topojson.feature(topology, topology.objects[i]).geometry);
          }
        }

        svg.append("svg:g")
          .selectAll("circle")
          .data(forest)
          .enter()
          .append("svg:circle")
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

      return country;
    },


    formatNumber: function(x, abs) {
      var parts = x.toString().split('.');

      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      var number = parts.join('.');

      if (abs && number) number = number.replace('-', ''); // abs

      return number;
    },

    numberForCircle: function(num, proc) {
      var num_ = !proc ? (num/1000000).toFixed(1) : num;

      return formatNumber(num_);
    },


    executeAjax: function(url, data, callback, type) {
      var jqxhr = null;
      var key = null;
      var val = null;

      type = type ? type : "GET";

      $.ajax({
        url: url,
        type: type,
        data: data,
        success: function(response) {
          if (callback) {
            callback.success(response);
          }
        },
        error: function(status, error) {
          if (callback) {
            callback.error(status, error);
          }
        },
        contentType: 'application/json',
        dataType: 'json'
      });

      return jqxhr;
    },

    positionScroll: function() {
      if($("header").hasClass("stuck")) {
        // stuck logo to top of viewport
        if($(window).scrollTop() < 49) {
          $(".header-logo").css({
            "position": "absolute",
            "top": "44px"
          });
        } else if($(window).scrollTop() >= 49 && $(window).scrollTop() <= 112) {
          $(".header-logo").css({
            "position": "fixed",
            "top": "0"
          });
        } else if($(window).scrollTop() > 112) {
          $(".header-logo").css({
            "position": "absolute",
            "top": "108px"
          });
        }
      }
    },

    validateEmail: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    prettifyFilename: function(filename) {
      return filename.toLowerCase().replace(/ /g,"_");
    },

    isLandsat: function(basemap) {
      var landsat = false;

      if ((basemap.indexOf("landsat") !== -1) && config.MAPSTYLES.landsat[basemap.replace('landsat', '')]) {
        landsat = config.MAPSTYLES.landsat[basemap.replace('landsat', '')]
      }

      return landsat;
    },

    updateHash: function(options) {
      var zoom = (typeof map !== 'undefined') ? map.getZoom() : 3,
          lat  = (typeof map !== 'undefined') ? map.getCenter().lat().toFixed(2) : 0,
          lng  = (typeof map !== 'undefined') ? map.getCenter().lng().toFixed(2) : 0,
          baselayer = config.BASELAYER === null ? 'none' : config.BASELAYER,
          layers = (config.MAPOPTIONS.layers.length > 0) ? '/'+config.MAPOPTIONS.layers : '',
          analysis = (config.BASELAYER === null || config.ISO !== 'ALL') ? '' : config.MAPOPTIONS.analysis,
          embed = $('body').hasClass('embed') ? 'embed/' : '';

      var hash = embed+'map/'+zoom+'/'+lat+'/'+lng+'/'+config.ISO+'/'+config.BASEMAP+'/'+baselayer+layers+analysis;

      if (options && options.replace) {
        window.router.navigate(hash, { replace: true });
      } else if (window.router && window.router) {
        window.router.navigate(hash, { trigger: true });
      }
    },
  };

  return CountryHelper;

});



// jQuery.fn.smartPlaceholder = function(opt){
//   this.each(function(){
//     var
//     speed   = (opt && opt.speed)   || 150,
//     timeOut = (opt && opt.timeOut) || 100,
//     $span   = $(this).find("span.holder"),
//     $input  = $(this).find(":input").not("input[type='hidden'], input[type='submit']");

//     if ($input.val()) {
//       $span.hide();
//     }

//     $input.keydown(function(e) {
//       if (e.metaKey && e.keyCode == 88) { // command+x
//         setTimeout(function() {
//           isEmpty($input.val()) && $span.fadeIn(speed);
//         }, timeOut);
//       } else if (e.metaKey && e.keyCode == 86) { // command+v
//         setTimeout(function() {
//           !isEmpty($input.val()) && $span.fadeOut(speed);
//         }, timeOut);
//       } else {
//         setTimeout(function() { ($input.val()) ?  $span.fadeOut(speed) : $span.fadeIn(speed); }, 0);
//       }
//     });

//     $span.click(function() { $input.focus(); });
//     $input.blur(function() { !$input.val() && $span.fadeIn(speed); });
//   });
// }
