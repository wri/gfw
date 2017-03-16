module Fog
  module Compute
    class XenServer
      class Real
        def set_locking_mode_vif(ref, vif_locking_mode)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VIF.set_locking_mode" }, ref, vif_locking_mode)
        end
      end
    end
  end
end
