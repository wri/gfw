module Fog
  module Compute
    class XenServer
      module Models
        class GpuGroups < Collection
          model Fog::Compute::XenServer::Models::GpuGroup
        end
      end
    end
  end
end