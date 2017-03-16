module Fog
  module Compute
    class XenServer
      module Models
        class HostCpus < Collection
          model Fog::Compute::XenServer::Models::HostCpu
        end
      end
    end
  end
end