require File.expand_path("../operating_system_family", __FILE__)

module Fog
  module Compute
    class Ecloud
      class OperatingSystemFamilies < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::OperatingSystemFamily

        def all
          data = service.get_operating_system_families(href).body[:OperatingSystemFamily]
          load(data)
        end

        def get(uri)
          if data = service.get_operating_system(uri)
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
