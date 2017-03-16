module Fog
  module Compute
    class XenServer
      class Real
        def db_introduce_pif(device, network, host, mac, mtu, vlan, physical, ip_configuration_mode, ip, netmask, gateway, dns, bond_slave_of, vlan_master_of, management, other_config, disallow_unplug, ipv6_configuration_mode, ipv6, ipv6_gateway, primary_address_type)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "PIF.db_introduce" }, device, network, host, mac, mtu, vlan, physical, ip_configuration_mode, ip, netmask, gateway, dns, bond_slave_of, vlan_master_of, management, other_config, disallow_unplug, ipv6_configuration_mode, ipv6, ipv6_gateway, primary_address_type)
        end
      end
    end
  end
end
