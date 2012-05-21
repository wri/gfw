module CapybaraHelpers
  def peich
    save_and_open_page
  end

  def map_click
    page.execute_script <<-JS
      (function(){

        if (map) {

          var mapBounds  = map.getBounds()
            , maxLat     = mapBounds.getNorthEast().lat()
            , maxLong    = mapBounds.getNorthEast().lng()
            , minLat     = mapBounds.getSouthWest().lat()
            , minLong    = mapBounds.getSouthWest().lng()
            , randomLat  = Math.random() * (maxLat - minLat) + minLat
            , randomLong = Math.random() * (maxLong - minLong) + minLong
            ;

          google.maps.event.trigger(map, 'click', {
            latLng: new google.maps.LatLng(randomLat, randomLong)
          });
        }
        return true;
      })();
    JS
  rescue
  end
end

RSpec.configure {|config| config.include CapybaraHelpers}
