module CapybaraHelpers
  def peich
    save_and_open_page
  end

  def draw_polygon
    page.execute_script <<-JS
      (function(){

        if (map) {

          var coords = [
            [-34.00628619273411,149.2542294921875],
            [-34.523817807809436,149.08394140625],
            [-34.55549214813776,149.9024228515625],
            [-34.18823878257324,150.1770810546875],
            [-33.883247279745014,149.710162109375]
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
