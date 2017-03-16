module Fog
  module Compute
    class XenServer
      module Models
        class Pcis < Collection
          model Fog::Compute::XenServer::Models::Pci
        end
      end
    end
  end
end