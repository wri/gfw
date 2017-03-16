module Fog
  module Compute
    class XenServer
      module Models
        class Networks < Collection
          model Fog::Compute::XenServer::Models::Network
        end
      end
    end
  end
end