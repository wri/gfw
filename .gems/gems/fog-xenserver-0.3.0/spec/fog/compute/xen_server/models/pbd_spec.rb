require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Pbd do
  let(:pbd_class) do
    class Fog::Compute::XenServer::Models::Pbd
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Pbd
  end

  it 'should associate to a provider class' do
    pbd_class.provider_class.must_equal('PBD')
  end

  it 'should have a collection name' do
    pbd_class.collection_name.must_equal(:pbds)
  end

  it 'should have an unique id' do
    pbd_class.read_identity.must_equal(:reference)
  end

  it 'should have 5 attributes' do
    pbd_class.attributes.must_equal([ :reference,
                                      :currently_attached,
                                      :device_config,
                                      :other_config,
                                      :uuid ])
  end

  it 'should have 2 associations' do
    pbd_class.associations.must_equal(:host => :hosts,
                                      :sr => :storage_repositories)
  end

  it 'should have 7 masks' do
    pbd_class.masks.must_equal(:reference => :reference, 
                               :currently_attached => :currently_attached, 
                               :device_config => :device_config, 
                               :other_config => :other_config, 
                               :uuid => :uuid, 
                               :host => :host, 
                               :sr => :SR)
  end

  it 'should have 1 alias' do
    pbd_class.attributes.must_equal([ :reference,
                                      :currently_attached,
                                      :device_config,
                                      :other_config,
                                      :uuid ])
  end

  it "shouldn't have aliases" do
    pbd_class.aliases.must_equal(:SR => :sr)
  end

  it "shouldn't have default values" do
    pbd_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    pbd_class.require_before_save.must_equal([])
  end
end