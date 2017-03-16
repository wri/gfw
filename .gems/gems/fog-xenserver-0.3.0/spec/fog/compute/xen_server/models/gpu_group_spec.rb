require 'minitest_helper'

describe Fog::Compute::XenServer::Models::GpuGroup do
  let(:gpu_group_class) do
    class Fog::Compute::XenServer::Models::GpuGroup
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::GpuGroup
  end

  it 'should associate to a provider class' do
    gpu_group_class.provider_class.must_equal('GPU_group')
  end

  it 'should have a collection name' do
    gpu_group_class.collection_name.must_equal(:gpu_groups)
  end

  it 'should have an unique id' do
    gpu_group_class.read_identity.must_equal(:reference)
  end

  it 'should have 6 attributes' do
    gpu_group_class.attributes.must_equal([ :reference,
                                            :description,
                                            :gpu_types,
                                            :name,
                                            :other_config,
                                            :uuid ])
  end

  it 'should have 2 associations' do
    gpu_group_class.associations.must_equal(:pgpus => :pgpus,
                                            :vgpus => :vgpus)
  end

  it 'should have 8 masks' do
    gpu_group_class.masks.must_equal(:reference => :reference,
                                     :description => :description, 
                                     :gpu_types => :GPU_types, 
                                     :name => :name, 
                                     :other_config => :other_config, 
                                     :uuid => :uuid, 
                                     :pgpus => :PGPUs, 
                                     :vgpus => :VGPUs)
  end

  it 'should have 5 aliases' do
    gpu_group_class.aliases.must_equal(:GPU_types => :gpu_types,
                                       :name_description => :description,
                                       :name_label => :name,
                                       :PGPUs => :pgpus,
                                       :VGPUs => :vgpus)
  end

  it "shouldn't have default values" do
    gpu_group_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    gpu_group_class.require_before_save.must_equal([])
  end
end