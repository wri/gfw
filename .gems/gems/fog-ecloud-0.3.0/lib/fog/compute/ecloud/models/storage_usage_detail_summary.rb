require File.expand_path("../storage_usage_detail", __FILE__)

module Fog
  module Compute
    class Ecloud
      class StorageUsageDetailSummary < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::StorageUsageDetail

        def all
          data = service.get_storage_usage_detail_summary(href).body[:VirtualMachines][:VirtualMachine]
          load(data)
        end

        def get(uri)
          if data = service.get_storage_usage_detail(uri)
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
