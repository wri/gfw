module Fog
  module Compute
    class XenServer
      module Models
        class HostsMetrics < Collection
          model Fog::Compute::XenServer::Models::HostMetrics
        end
      end
    end
  end
end