require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Bond do
  let(:bond_class) do
    class Fog::Compute::XenServer::Models::Bond
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Bond
  end

  it 'should associate to a provider class' do
    bond_class.provider_class.must_equal('Bond')
  end

  it 'should have a collection name' do
    bond_class.collection_name.must_equal(:bonds)
  end

  it 'should have an unique id' do
    bond_class.read_identity.must_equal(:reference)
  end

  it 'should have 6 attributes' do
    bond_class.attributes.must_equal([ :reference,
                                       :links_up,
                                       :mode,
                                       :other_config,
                                       :properties,
                                       :uuid ])
  end

  it 'should have 3 associations' do
    bond_class.associations.must_equal(:master => :pifs, 
                                       :primary_slave => :pifs, 
                                       :slaves => :pifs)
  end

  it 'should have 6 masks' do
    bond_class.masks.must_equal(:reference => :reference,
                                :links_up => :links_up, 
                                :mode => :mode, 
                                :other_config => :other_config, 
                                :properties => :properties, 
                                :uuid => :uuid, 
                                :master => :master, 
                                :primary_slave => :primary_slave, 
                                :slaves => :slaves)
  end

  it "shouldn't have aliases" do
    bond_class.aliases.must_equal({})
  end

  it "shouldn't have default values" do
    bond_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    bond_class.require_before_save.must_equal([])
  end
end