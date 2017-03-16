require File.expand_path('../flavor', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class Flavors < Fog::Collection
        model Fog::Compute::ProfitBricks::Flavor

        def all
          load(service.get_all_flavors.body["getAllFlavorsResponse"])
        end

        def get(id)
          flavor = service.get_flavor(id).body["getFlavorResponse"]
          new(flavor)
        end
      end
    end
  end
end
