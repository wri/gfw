module Fog
  module Compute
    class XenServer
      module Models
        class Vifs < Collection
          model Fog::Compute::XenServer::Models::Vif
        end
      end
    end
  end
end