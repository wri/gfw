require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Vtpm do
  let(:vtpm_class) do
    class Fog::Compute::XenServer::Models::Vtpm
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Vtpm
  end

  it 'should associate to a provider class' do
    vtpm_class.provider_class.must_equal('VTPM')
  end

  it 'should have a collection name' do
    vtpm_class.collection_name.must_equal(:vtpms)
  end

  it 'should have an unique id' do
    vtpm_class.read_identity.must_equal(:reference)
  end

  it 'should have 2 attributes' do
    vtpm_class.attributes.must_equal([ :reference,
                                       :uuid ])
  end

  it 'should have 2 associations' do
    vtpm_class.associations.must_equal(:backend => :servers,
                                       :vm => :servers)
  end

  it 'should have 4 masks' do
    vtpm_class.masks.must_equal(:reference => :reference,
                                :uuid => :uuid,
                                :backend => :backend,
                                :vm => :vm)
  end

  it "shouldn't have aliases" do
    vtpm_class.aliases.must_equal({})
  end

  it "shouldn't have default values" do
    vtpm_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    vtpm_class.require_before_save.must_equal([])
  end
end