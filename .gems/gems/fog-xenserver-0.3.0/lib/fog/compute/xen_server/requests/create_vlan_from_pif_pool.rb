module Fog
  module Compute
    class XenServer
      class Real
        def create_vlan_from_pif_pool(pif, network, vlan)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.create_VLAN_from_PIF" }, pif, network, vlan)
        end
      end
    end
  end
end
