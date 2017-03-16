module Fog
  module Compute
    class XenServer
      class Real
        def create_vlan_pool(device, network, vlan)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.create_VLAN" }, device, network, vlan)
        end
      end
    end
  end
end
