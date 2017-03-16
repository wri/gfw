module Fog
  module Compute
    class XenServer
      module Models
        class ServersMetrics < Collection
          model Fog::Compute::XenServer::Models::ServerMetrics
        end
      end
    end
  end
end