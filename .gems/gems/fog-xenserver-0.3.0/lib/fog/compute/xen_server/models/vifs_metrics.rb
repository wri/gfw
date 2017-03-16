module Fog
  module Compute
    class XenServer
      module Models
        class VifsMetrics < Collection
          model Fog::Compute::XenServer::Models::VifMetrics
        end
      end
    end
  end
end