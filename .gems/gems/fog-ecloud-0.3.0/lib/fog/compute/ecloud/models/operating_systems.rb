require File.expand_path("../operating_system", __FILE__)

module Fog
  module Compute
    class Ecloud
      class OperatingSystems < Fog::Ecloud::Collection
        model Fog::Compute::Ecloud::OperatingSystem

        identity :data

        def all
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
