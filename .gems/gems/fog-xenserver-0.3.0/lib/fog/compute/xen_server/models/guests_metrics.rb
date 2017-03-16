module Fog
  module Compute
    class XenServer
      module Models
        class GuestsMetrics < Collection
          model Fog::Compute::XenServer::Models::GuestMetrics
        end
      end
    end
  end
end