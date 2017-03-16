module Fog
  module Compute
    class XenServer
      module Models
        class Events < Collection
          model Fog::Compute::XenServer::Models::Event
        end
      end
    end
  end
end
