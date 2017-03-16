require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Network do
  let(:network_class) do
    class Fog::Compute::XenServer::Models::Network
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Network
  end

  it 'should associate to a provider class' do
    network_class.provider_class.must_equal('network')
  end

  it 'should have a collection name' do
    network_class.collection_name.must_equal(:networks)
  end

  it 'should have an unique id' do
    network_class.read_identity.must_equal(:reference)
  end

  it 'should have 12 attributes' do
    network_class.attributes.must_equal([ :reference,
                                          :allowed_operations,
                                          :blobs,
                                          :bridge,
                                          :current_operations,
                                          :default_locking_mode,
                                          :description,
                                          :mtu,
                                          :name,
                                          :other_config,
                                          :tags,
                                          :uuid ])
  end

  it 'should have 2 associations' do
    network_class.associations.must_equal(:pifs => :pifs,
                                          :vifs => :vifs)
  end

  it 'should have 14 masks' do
    network_class.masks.must_equal(:reference => :reference, 
                                   :allowed_operations => :allowed_operations, 
                                   :blobs => :blobs, 
                                   :bridge => :bridge, 
                                   :current_operations => :current_operations, 
                                   :default_locking_mode => :default_locking_mode, 
                                   :description => :name_description,
                                   :mtu => :MTU, 
                                   :name => :name_label,
                                   :other_config => :other_config, 
                                   :tags => :tags, 
                                   :uuid => :uuid, 
                                   :pifs => :PIFs, 
                                   :vifs => :VIFs)
  end

  it 'should have 5 aliases' do
    network_class.aliases.must_equal(:MTU => :mtu,
                                     :name_description => :description,
                                     :name_label => :name,
                                     :PIFs => :pifs,
                                     :VIFs => :vifs)
  end

  it 'should have 3 default values' do
    network_class.default_values.must_equal(:description => '',
                                            :name => '',
                                            :other_config => {})
  end

  it 'should require 1 attribute before save' do
    network_class.require_before_save.must_equal([ :name ])
  end
end