module Fog
  module Compute
    class XenServer
      module Models
        class Hosts < Collection
          model Fog::Compute::XenServer::Models::Host
        end
      end
    end
  end
end