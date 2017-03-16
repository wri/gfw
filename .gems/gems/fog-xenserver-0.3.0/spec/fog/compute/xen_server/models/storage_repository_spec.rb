require 'minitest_helper'

describe Fog::Compute::XenServer::Models::StorageRepository do
  let(:storage_repository_class) do
    class Fog::Compute::XenServer::Models::StorageRepository
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::StorageRepository
  end

  it 'should associate to a provider class' do
    storage_repository_class.provider_class.must_equal('SR')
  end

  it 'should have a collection name' do
    storage_repository_class.collection_name.must_equal(:storage_repositories)
  end

  it 'should have an unique id' do
    storage_repository_class.read_identity.must_equal(:reference)
  end

  it 'should have 18 attributes' do
    storage_repository_class.attributes.must_equal([ :reference,
                                                     :allowed_operations,
                                                     :blobs,
                                                     :content_type,
                                                     :current_operations,
                                                     :description,
                                                     :introduced_by,
                                                     :local_cache_enabled,
                                                     :name,
                                                     :other_config,
                                                     :physical_size,
                                                     :physical_utilisation,
                                                     :shared,
                                                     :sm_config,
                                                     :tags,
                                                     :type,
                                                     :uuid,
                                                     :virtual_allocation ])
  end

  it 'should have 2 associations' do
    storage_repository_class.associations.must_equal(:pbds => :pbds,
                                                     :vdis => :vdis)
  end

  it 'should have 20 masks' do
    storage_repository_class.masks.must_equal(:reference => :reference, 
                                              :allowed_operations => :allowed_operations, 
                                              :blobs => :blobs, 
                                              :content_type => :content_type, 
                                              :current_operations => :current_operations, 
                                              :description => :description, 
                                              :introduced_by => :introduced_by, 
                                              :local_cache_enabled => :local_cache_enabled, 
                                              :name => :name, 
                                              :other_config => :other_config, 
                                              :physical_size => :physical_size, 
                                              :physical_utilisation => :physical_utilisation, 
                                              :shared => :shared, 
                                              :sm_config => :sm_config, 
                                              :tags => :tags, 
                                              :type => :type, 
                                              :uuid => :uuid, 
                                              :virtual_allocation => :virtual_allocation, 
                                              :pbds => :PBDs, 
                                              :vdis => :VDIs)
  end

  it 'should have 4 aliases' do
    storage_repository_class.aliases.must_equal(:name_label => :name,
                                                :name_description => :description,
                                                :PBDs => :pbds,
                                                :VDIs => :vdis)
  end

  it 'should have 5 default values' do
    storage_repository_class.default_values.must_equal(:content_type => 'user',
                                                       :shared => false,
                                                       :description => '',
                                                       :physical_size => '0',
                                                       :sm_config => {})
  end

  it 'should require 2 attributes before save' do
    storage_repository_class.require_before_save.must_equal([ :name, :type ])
  end
end