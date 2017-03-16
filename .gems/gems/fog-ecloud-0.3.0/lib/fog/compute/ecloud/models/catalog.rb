require File.expand_path("../catalog_item", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Catalog < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::CatalogItem

        def all
          data = service.get_catalog(href).body # [:Locations][:Location][:Catalog][:CatalogEntry]
          if data[:Locations][:Location].is_a?(Hash)
            data = [] if data[:Locations][:Location][:Catalog].is_a?(String) && data[:Locations][:Location][:Catalog].empty?
            load(data)
          elsif data[:Locations][:Location].is_a?(Array)
            r_data = []
            data[:Locations][:Location].each do |d|
              unless d[:Catalog].is_a?(String) && d[:Catalog].empty?
                d[:Catalog][:CatalogEntry].each do |c|
                  r_data << c
                end
              end
            end
            load(r_data)
          end
        end

        def get(uri)
          if data = service.get_catalog_item(uri)
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
