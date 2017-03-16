module Fog
  module Compute
    class Terremark
      class Images < Fog::Collection
        model Fog::Compute::Terremark::Image

        def all
          data = service.get_catalog(vdc_id).body["CatalogItems"].select do |entity|
            entity["type"] == "application/vnd.vmware.vcloud.catalogItem+xml"
          end
          load(data)
        end

        def vdc_id
          @vdc_id ||= service.default_vdc_id
        end

        private

        def vdc_id=(new_vdc_id)
          @vdc_id = new_vdc_id
        end
      end
    end
  end
end
