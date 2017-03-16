require 'minitest_helper'

describe Fog::Compute::XenServer::Models::HostPatch do
  let(:host_patch_class) do
    class Fog::Compute::XenServer::Models::HostPatch
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::HostPatch
  end

  it 'should associate to a provider class' do
    host_patch_class.provider_class.must_equal('host_patch')
  end

  it 'should have a collection name' do
    host_patch_class.collection_name.must_equal(:host_patchs)
  end

  it 'should have an unique id' do
    host_patch_class.read_identity.must_equal(:reference)
  end

  it 'should have 9 attributes' do
    host_patch_class.attributes.must_equal([ :reference,
                                             :applied,
                                             :description,
                                             :name,
                                             :other_config,
                                             :size,
                                             :timestamp_applied,
                                             :uuid,
                                             :version ])
  end

  it 'should have 2 associations' do
    host_patch_class.associations.must_equal(:host => :hosts,
                                             :pool_patch => :pool_patchs)
  end

  it 'should have 11 masks' do
    host_patch_class.masks.must_equal(:reference => :reference, 
                                      :applied => :applied, 
                                      :description => :description, 
                                      :name => :name, 
                                      :other_config => :other_config, 
                                      :size => :size, 
                                      :timestamp_applied => :timestamp_applied, 
                                      :uuid => :uuid, 
                                      :version => :version, 
                                      :host => :host, 
                                      :pool_patch => :pool_patch)
  end

  it 'should have 2 aliases' do
    host_patch_class.aliases.must_equal(:name_description => :description,
                                        :name_label => :name)
  end

  it "shouldn't have default values" do
    host_patch_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    host_patch_class.require_before_save.must_equal([])
  end
end