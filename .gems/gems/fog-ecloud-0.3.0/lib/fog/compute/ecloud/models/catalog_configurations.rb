require File.expand_path("../catalog_configuration", __FILE__)

module Fog
  module Compute
    class Ecloud
      class CatalogConfigurations < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::CatalogConfiguration

        def all
          data = service.get_catalog_configurations(href).body
          load(data)
        end

        def get(uri)
          if data = service.get_catalog_configuration(uri)
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
