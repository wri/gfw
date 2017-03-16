module Fog
  module Compute
    class XenServer
      module Models
        class Bonds < Collection
          model Fog::Compute::XenServer::Models::Bond
        end
      end
    end
  end
end