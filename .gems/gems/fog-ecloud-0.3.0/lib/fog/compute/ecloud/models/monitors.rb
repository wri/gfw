require File.expand_path("../monitor", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Monitors < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::Monitor

        def all
          data = service.get_monitors(href).body
          load(data)
        end

        def get(uri)
          if data = service.get_monitor(uri)
            new(data.body)
          end
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end

        def from_data(data)
          new(data)
        end
      end
    end
  end
end
