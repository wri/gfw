require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Pif do
  let(:pif_class) do
    class Fog::Compute::XenServer::Models::Pif
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Pif
  end

  it 'should associate to a provider class' do
    pif_class.provider_class.must_equal('PIF')
  end

  it 'should have a collection name' do
    pif_class.collection_name.must_equal(:pifs)
  end

  it 'should have an unique id' do
    pif_class.read_identity.must_equal(:reference)
  end

  it 'should have 23 attributes' do
    pif_class.attributes.must_equal([ :reference,
                                      :disallow_unplug,
                                      :currently_attached,
                                      :device,
                                      :device_name,
                                      :dns,
                                      :gateway,
                                      :ip,
                                      :ip_configuration_mode,
                                      :ipv6,
                                      :ipv6_configuration_mode,
                                      :ipv6_gateway,
                                      :mac,
                                      :management,
                                      :mtu,
                                      :netmask,
                                      :other_config,
                                      :physical,
                                      :primary_address_type,
                                      :status_code,
                                      :status_detail,
                                      :vlan,
                                      :uuid ])
  end

  it 'should have 9 associations' do
    pif_class.associations.must_equal(:bond_master_of => :bonds, 
                                      :bond_slave_of => :bonds, 
                                      :host => :hosts, 
                                      :metrics => :pif_metrics, 
                                      :network => :networks, 
                                      :tunnel_access_pif_of => :tunnels, 
                                      :tunnel_transport_pif_of => :tunnels, 
                                      :vlan_master_of => :vlans, 
                                      :vlan_slave_of => :vlans)
  end

  it 'should have 32 masks' do
    pif_class.masks.must_equal(:reference => :reference, 
                               :disallow_unplug => :disallow_unplug, 
                               :currently_attached => :currently_attached, 
                               :device => :device, 
                               :device_name => :device_name, 
                               :dns => :DNS, 
                               :gateway => :gateway, 
                               :ip => :IP, 
                               :ip_configuration_mode => :ip_configuration_mode, 
                               :ipv6 => :IPv6, 
                               :ipv6_configuration_mode => :ipv6_configuration_mode, 
                               :ipv6_gateway => :ipv6_gateway, 
                               :mac => :MAC, 
                               :management => :management, 
                               :mtu => :MTU, 
                               :netmask => :netmask, 
                               :other_config => :other_config, 
                               :physical => :physical, 
                               :primary_address_type => :primary_address_type, 
                               :status_code => :status_code, 
                               :status_detail => :status_detail, 
                               :vlan => :VLAN, 
                               :uuid => :uuid, 
                               :bond_master_of => :bond_master_of, 
                               :bond_slave_of => :bond_slave_of, 
                               :host => :host, 
                               :metrics => :metrics, 
                               :network => :network, 
                               :tunnel_access_pif_of => :tunnel_access_PIF_of, 
                               :tunnel_transport_pif_of => :tunnel_transport_PIF_of, 
                               :vlan_master_of => :VLAN_master_of, 
                               :vlan_slave_of => :VLAN_slave_of)
  end

  it 'should have 6 aliases' do
    pif_class.aliases.must_equal(:MAC => :mac,
                                 :DNS => :dns,
                                 :IP => :ip,
                                 :IPv6 => :ipv6,
                                 :MTU => :mtu,
                                 :VLAN => :vlan,
                                 :tunnel_access_PIF_of => :tunnel_access_pif_of,
                                 :tunnel_transport_PIF_of => :tunnel_transport_pif_of,
                                 :VLAN_master_of => :vlan_master_of,
                                 :VLAN_slave_of => :vlan_slave_of)
  end

  it "shouldn't have default values" do
    pif_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    pif_class.require_before_save.must_equal([])
  end
end