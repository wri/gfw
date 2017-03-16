require File.expand_path("../location", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Locations < Fog::Ecloud::Collection
        model Fog::Compute::Ecloud::Location

        undef_method :create

        identity :href

        def all
          data = service.get_organization(href).body[:Locations][:Location]
          load(data)
        end

        def get(uri)
          if data = service.get_location(uri)
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
