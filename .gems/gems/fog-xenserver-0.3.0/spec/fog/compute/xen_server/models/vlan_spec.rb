require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Vlan do
  let(:vlan_class) do
    class Fog::Compute::XenServer::Models::Vlan
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Vlan
  end

  it 'should associate to a provider class' do
    vlan_class.provider_class.must_equal('VLAN')
  end

  it 'should have a collection name' do
    vlan_class.collection_name.must_equal(:vlans)
  end

  it 'should have an unique id' do
    vlan_class.read_identity.must_equal(:reference)
  end

  it 'should have 4 attributes' do
    vlan_class.attributes.must_equal([ :reference,
                                       :other_config,
                                       :tag,
                                       :uuid ])
  end

  it 'should have 2 associations' do
    vlan_class.associations.must_equal(:tagged_pif => :pifs,
                                       :untagged_pif => :pifs)
  end

  it 'should have 6 masks' do
    vlan_class.masks.must_equal(:reference => :reference, 
                                :other_config => :other_config, 
                                :tag => :tag, 
                                :uuid => :uuid, 
                                :tagged_pif => :tagged_PIF, 
                                :untagged_pif => :untagged_PIF)
  end

  it 'should have 2 aliases' do
    vlan_class.aliases.must_equal(:tagged_PIF => :tagged_pif,
                                  :untagged_PIF => :untagged_pif)
  end

  it "shouldn't have default values" do
    vlan_class.default_values.must_equal({})
  end

  it 'should require 1 attribute before save' do
    vlan_class.require_before_save.must_equal([ :tag ])
  end
end