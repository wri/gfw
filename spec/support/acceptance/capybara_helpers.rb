module CapybaraHelpers
  def peich
    save_and_open_page
  end

  def draw_polygon
    page.execute_script <<-JS
      (function(){

        if (map) {

          var coords = [
            [32.24997445586333, -3.779296875],
            [26.58852714730864, -8.525390625],
            [20.303417518489326, -2.021484375],
            [23.56398712845124, 9.228515625],
            [29.688052749856826, 6.943359375],
            [ 32.54681317351516, 5.712890625 ]
          ];

          $.each(coords, function(index, coord){
            google.maps.event.trigger(map, 'click', {
              latLng: new google.maps.LatLng(coord[0], coord[1])
            });
          });
        }
        return true;
      })();
    JS
  rescue
  end
end

RSpec.configure {|config| config.include CapybaraHelpers}
