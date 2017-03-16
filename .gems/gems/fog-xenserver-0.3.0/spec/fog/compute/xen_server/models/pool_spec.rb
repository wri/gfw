require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Pool do
  let(:pool_class) do
    class Fog::Compute::XenServer::Models::Pool
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Pool
  end

  it 'should associate to a provider class' do
    pool_class.provider_class.must_equal('pool')
  end

  it 'should have a collection name' do
    pool_class.collection_name.must_equal(:pools)
  end

  it 'should have an unique id' do
    pool_class.read_identity.must_equal(:reference)
  end

  it 'should have 23 attributes' do
    pool_class.attributes.must_equal([ :reference,
                                       :blobs,
                                       :description,
                                       :gui_config,
                                       :ha_allow_overcommit,
                                       :ha_configuration,
                                       :ha_enabled,
                                       :ha_host_failures_to_tolerate,
                                       :ha_overcommitted,
                                       :ha_plan_exists_for,
                                       :ha_statefiles,
                                       :name,
                                       :other_config,
                                       :redo_log_enabled,
                                       :redo_log_vdi,
                                       :restrictions,
                                       :tags,
                                       :uuid,
                                       :vswitch_controller,
                                       :wlb_enabled,
                                       :wlb_url,
                                       :wlb_username,
                                       :wlb_verify_cert ])
  end

  it 'should have 5 associations' do
    pool_class.associations.must_equal(:crash_dump_sr => :storage_repositories, 
                                       :default_sr => :storage_repositories, 
                                       :master => :hosts, 
                                       :metadata_vdis => :vdis, 
                                       :suspend_image_sr => :storage_repositories)
  end

  it 'should have 28 masks' do
    pool_class.masks.must_equal(:reference => :reference, 
                                :blobs => :blobs, 
                                :description => :description, 
                                :gui_config => :gui_config, 
                                :ha_allow_overcommit => :ha_allow_overcommit, 
                                :ha_configuration => :ha_configuration, 
                                :ha_enabled => :ha_enabled, 
                                :ha_host_failures_to_tolerate => :ha_host_failures_to_tolerate, 
                                :ha_overcommitted => :ha_overcommitted, 
                                :ha_plan_exists_for => :ha_plan_exists_for, 
                                :ha_statefiles => :ha_statefiles, 
                                :name => :name, 
                                :other_config => :other_config, 
                                :redo_log_enabled => :redo_log_enabled, 
                                :redo_log_vdi => :redo_log_vdi, 
                                :restrictions => :restrictions, 
                                :tags => :tags, 
                                :uuid => :uuid, 
                                :vswitch_controller => :vswitch_controller, 
                                :wlb_enabled => :wlb_enabled, 
                                :wlb_url => :wlb_url, 
                                :wlb_username => :wlb_username, 
                                :wlb_verify_cert => :wlb_verify_cert, 
                                :crash_dump_sr => :crash_dump_SR, 
                                :default_sr => :default_SR, 
                                :master => :master, 
                                :metadata_vdis => :metadata_VDIs, 
                                :suspend_image_sr => :suspend_image_SR)
  end

  it 'should have 6 aliases' do
    pool_class.aliases.must_equal(:name_label => :name,
                                  :name_description => :description,
                                  :crash_dump_SR => :crash_dump_sr,
                                  :default_SR => :default_sr,
                                  :metadata_VDIs => :metadata_vdis,
                                  :suspend_image_SR => :suspend_image_sr)
  end

  it "shouldn't have default values" do
    pool_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    pool_class.require_before_save.must_equal([])
  end
end