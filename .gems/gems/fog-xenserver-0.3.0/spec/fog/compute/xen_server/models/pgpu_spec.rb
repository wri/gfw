require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Pgpu do
  let(:pgpu_class) do
    class Fog::Compute::XenServer::Models::Pgpu
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Pgpu
  end

  it 'should associate to a provider class' do
    pgpu_class.provider_class.must_equal('PGPU')
  end

  it 'should have a collection name' do
    pgpu_class.collection_name.must_equal(:pgpus)
  end

  it 'should have an unique id' do
    pgpu_class.read_identity.must_equal(:reference)
  end

  it 'should have 3 attributes' do
    pgpu_class.attributes.must_equal([ :reference,
                                       :other_config,
                                       :uuid ])
  end

  it 'should have 3 associations' do
    pgpu_class.associations.must_equal(:gpu_group => :gpu_groups,
                                       :host => :hosts,
                                       :pci => :pcis)
  end

  it 'should have 6 masks' do
    pgpu_class.masks.must_equal(:reference => :reference,
                                :other_config => :other_config,
                                :uuid => :uuid,
                                :gpu_group => :GPU_group,
                                :host => :host,
                                :pci => :PCI)
  end

  it 'should have 2 aliases' do
    pgpu_class.aliases.must_equal(:GPU_group => :gpu_group,
                                  :PCI => :pci)
  end

  it "shouldn't have default values" do
    pgpu_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    pgpu_class.require_before_save.must_equal([])
  end
end