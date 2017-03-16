require 'minitest_helper'

describe Fog::Compute::XenServer::Models::PoolPatch do
  let(:pool_patch_class) do
    class Fog::Compute::XenServer::Models::PoolPatch
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::PoolPatch
  end

  it 'should associate to a provider class' do
    pool_patch_class.provider_class.must_equal('pool_patch')
  end

  it 'should have a collection name' do
    pool_patch_class.collection_name.must_equal(:pool_patchs)
  end

  it 'should have an unique id' do
    pool_patch_class.read_identity.must_equal(:reference)
  end

  it 'should have 9 attributes' do
    pool_patch_class.attributes.must_equal([ :reference,
                                             :after_apply_guidance,
                                             :description,
                                             :name,
                                             :other_config,
                                             :pool_applied,
                                             :size,
                                             :uuid,
                                             :version ])
  end

  it 'should have 1 association' do
    pool_patch_class.associations.must_equal(:host_patches => :host_patchs)
  end

  it 'should have 10 masks' do
    pool_patch_class.masks.must_equal(:reference => :reference, 
                                      :after_apply_guidance => :after_apply_guidance, 
                                      :description => :description, 
                                      :name => :name, 
                                      :other_config => :other_config, 
                                      :pool_applied => :pool_applied, 
                                      :size => :size, 
                                      :uuid => :uuid, 
                                      :version => :version, 
                                      :host_patches => :host_patches)
  end

  it 'should have 2 aliases' do
    pool_patch_class.aliases.must_equal(:name_description => :description,
                                        :name_label => :name)
  end

  it "shouldn't have default values" do
    pool_patch_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    pool_patch_class.require_before_save.must_equal([])
  end
end