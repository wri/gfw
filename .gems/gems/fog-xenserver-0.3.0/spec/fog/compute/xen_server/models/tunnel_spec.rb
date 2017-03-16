require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Tunnel do
  let(:tunnel_class) do
    class Fog::Compute::XenServer::Models::Tunnel
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Tunnel
  end

  it 'should associate to a provider class' do
    tunnel_class.provider_class.must_equal('tunnel')
  end

  it 'should have a collection name' do
    tunnel_class.collection_name.must_equal(:tunnels)
  end

  it 'should have an unique id' do
    tunnel_class.read_identity.must_equal(:reference)
  end

  it 'should have 4 attributes' do
    tunnel_class.attributes.must_equal([ :reference,
                                         :other_config,
                                         :status,
                                         :uuid ])
  end

  it 'should have 1 association' do
    tunnel_class.associations.must_equal(:access_pif => :pifs,
                                         :transport_pif => :pifs)
  end

  it 'should have 5 masks' do
    tunnel_class.masks.must_equal(:reference => :reference, 
                                  :other_config => :other_config, 
                                  :status => :status, :uuid => :uuid, 
                                  :access_pif => :access_PIF, 
                                  :transport_pif => :transport_PIF)
  end

  it 'should have 2 aliases' do
    tunnel_class.aliases.must_equal(:access_PIF => :access_pif,
                                    :transport_PIF => :transport_pif)
  end

  it "shouldn't have default values" do
    tunnel_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    tunnel_class.require_before_save.must_equal([])
  end
end