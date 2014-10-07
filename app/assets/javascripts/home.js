//= require jquery
//= require jquery.easing.1.3
//= require gfw
//= require gfw/helpers
//= require gfw/ui/circle

// Circle
$(document).ready(function() {

  // HomeSlider
  Circle = new gfw.ui.view.Circle({ circles: circleSummary });
  $('#homeSlider').append(Circle.render());
  Circle.show();

  // Home stories
  (function() {

    var content = '';
    var $ul = $('.home_stories').find('.columns');

    $.ajax({
      url: 'https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20cartodb_id,title,media,ST_AsGeoJSON(the_geom)%20AS%20the_geom%20FROM%20community_stories%20WHERE%20visible=true%20order%20by%20created_at%20desc%20LIMIT%203',
      success: function(data) {
        data = data.rows;

        for (var i = 0; i < data.length; i++) {
          data[i].media = jQuery.parseJSON(data[i].media);
          var geom = JSON.parse(data[i].the_geom);
          var _url = function(media, lat, lng) {
            var img = media[media.length - 1].preview_url;
            var url = 'http://gfw2stories.s3.amazonaws.com/uploads/' + img;
            if (!img) {
              url = 'http://maps.google.com/maps/api/staticmap?center=' + lat.toFixed(3) + ',' + lng.toFixed(3) + '&zoom=4&size=266x266&maptype=terrain&sensor=false'
            }
            return  url;
          }
          content += '<li class="column round three">';
          content += '<a href="/stories/' + data[i].cartodb_id + '">';
          content += '<img src=" ' + _url(data[i].media, geom.coordinates[0], geom.coordinates[1]) + '" alt="' + data[i].title + '" />';
          content += '<div class="frame"></div>';
          content += '<div class="gradient"></div>';
          content += '<div class="title">';
          content += '<strong>' + data[i].title + '</strong>';
          content += '<span>read more</span>';
          content += '</div>';
          content += '</a>';
          content += '</li>';
        }
        $ul.find('.spinner').fadeOut(function(){
          $ul.append(content);
        })
      },
      error: function(status, error) {
        $ul.find('.spinner').fadeOut(function(){
          $ul.append('<li class="column round three">No stories available</li>');
        })
      }
    });

  }());

});
