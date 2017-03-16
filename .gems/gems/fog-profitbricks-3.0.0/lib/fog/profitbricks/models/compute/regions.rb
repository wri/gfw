require File.expand_path('../region', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class Regions < Fog::Collection
        model Fog::Compute::ProfitBricks::Region

        def all
          load(service.get_all_locations.body["getAllLocationsResponse"])
        end

        def get(id)
          region = service.get_location(id).body["getLocationResponse"]
          new(region)
        end
      end
    end
  end
end
