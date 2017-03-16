require File.expand_path("../memory_usage_detail", __FILE__)

module Fog
  module Compute
    class Ecloud
      class MemoryUsageDetailSummary < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::MemoryUsageDetail

        def all
          data = service.get_memory_usage_detail_summary(href).body[:MemoryUsageDetailSummary][:MemoryUsageDetail]
          load(data)
        end

        def get(uri)
          if data = service.get_memory_usage_detail(uri)
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
