module Fog
  module Compute
    class XenServer
      module Models
        class Vlans < Collection
          model Fog::Compute::XenServer::Models::Vlan
        end
      end
    end
  end
end