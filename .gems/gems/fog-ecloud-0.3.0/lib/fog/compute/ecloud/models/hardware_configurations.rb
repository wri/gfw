require File.expand_path("../hardware_configuration", __FILE__)

module Fog
  module Compute
    class Ecloud
      class HardwareConfigurations < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::HardwareConfiguration

        def all
          data = service.get_server(href).body
          load(data)
        end

        def get(uri)
          if data = service.get_hardware_configuration(uri)
            new(data.body)
          end
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end
      end
    end
  end
end
