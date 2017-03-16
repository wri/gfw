require 'minitest_helper'

describe Fog::Compute::XenServer::Models::StorageManager do
  let(:storage_manager_class) do
    class Fog::Compute::XenServer::Models::StorageManager
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::StorageManager
  end

  it 'should associate to a provider class' do
    storage_manager_class.provider_class.must_equal('SM')
  end

  it 'should have a collection name' do
    storage_manager_class.collection_name.must_equal(:storage_managers)
  end

  it 'should have an unique id' do
    storage_manager_class.read_identity.must_equal(:reference)
  end

  it 'should have 14 attributes' do
    storage_manager_class.attributes.must_equal([ :reference,
                                                  :capabilities,
                                                  :configuration,
                                                  :copyright,
                                                  :description,
                                                  :driver_filename,
                                                  :features,
                                                  :name,
                                                  :other_config,
                                                  :required_api_version,
                                                  :type,
                                                  :uuid,
                                                  :vendor,
                                                  :version ])
  end

  it "shouldn't have associations" do
    storage_manager_class.associations.must_equal({})
  end

  it 'should have 14 masks' do
    storage_manager_class.masks.must_equal(:reference => :reference, 
                                           :capabilities => :capabilities, 
                                           :configuration => :configuration, 
                                           :copyright => :copyright, 
                                           :description => :description, 
                                           :driver_filename => :driver_filename, 
                                           :features => :features, 
                                           :name => :name, 
                                           :other_config => :other_config, 
                                           :required_api_version => :required_api_version, 
                                           :type => :type, 
                                           :uuid => :uuid, 
                                           :vendor => :vendor, 
                                           :version => :version)
  end

  it 'should have 2 aliases' do
    storage_manager_class.aliases.must_equal({ :name_description => :description,
                                               :name_label => :name })
  end

  it "shouldn't have default values" do
    storage_manager_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    storage_manager_class.require_before_save.must_equal([])
  end
end