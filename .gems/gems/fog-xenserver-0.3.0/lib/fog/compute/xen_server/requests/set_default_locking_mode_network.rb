module Fog
  module Compute
    class XenServer
      class Real
        def set_default_locking_mode_network(ref, network_default_locking_mode)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "network.set_default_locking_mode" }, ref, network_default_locking_mode)
        end
      end
    end
  end
end
