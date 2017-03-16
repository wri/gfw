require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Vmpp do
  let(:vmpp_class) do
    class Fog::Compute::XenServer::Models::Vmpp
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Vmpp
  end

  it 'should associate to a provider class' do
    vmpp_class.provider_class.must_equal('VMPP')
  end

  it 'should have a collection name' do
    vmpp_class.collection_name.must_equal(:vmpps)
  end

  it 'should have an unique id' do
    vmpp_class.read_identity.must_equal(:reference)
  end

  it 'should have 20 attributes' do
    vmpp_class.attributes.must_equal([ :reference,
                                       :alarm_config,
                                       :archive_frequency,
                                       :archive_last_run_time,
                                       :archive_schedule,
                                       :archive_target_config,
                                       :archive_target_type,
                                       :backup_frequency,
                                       :backup_last_run_time,
                                       :backup_retention_value,
                                       :backup_schedule,
                                       :backup_type,
                                       :description,
                                       :is_alarm_enabled,
                                       :is_archive_running,
                                       :is_backup_running,
                                       :is_policy_enabled,
                                       :name,
                                       :recent_alerts,
                                       :uuid ])
  end

  it 'should have 1 association' do
    vmpp_class.associations.must_equal(:vms => :servers)
  end

  it 'should have 21 masks' do
    vmpp_class.masks.must_equal(:reference => :reference, 
                                :alarm_config => :alarm_config, 
                                :archive_frequency => :archive_frequency, 
                                :archive_last_run_time => :archive_last_run_time, 
                                :archive_schedule => :archive_schedule, 
                                :archive_target_config => :archive_target_config, 
                                :archive_target_type => :archive_target_type, 
                                :backup_frequency => :backup_frequency, 
                                :backup_last_run_time => :backup_last_run_time, 
                                :backup_retention_value => :backup_retention_value, 
                                :backup_schedule => :backup_schedule, 
                                :backup_type => :backup_type, 
                                :description => :description, 
                                :is_alarm_enabled => :is_alarm_enabled, 
                                :is_archive_running => :is_archive_running, 
                                :is_backup_running => :is_backup_running, 
                                :is_policy_enabled => :is_policy_enabled, 
                                :name => :name, 
                                :recent_alerts => :recent_alerts, 
                                :uuid => :uuid, 
                                :vms => :VMs)
  end

  it 'should have 2 aliases' do
    vmpp_class.aliases.must_equal(:name_description => :description,
                                  :name_label => :name,
                                  :VMs => :vms)
  end

  it "shouldn't have default values" do
    vmpp_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    vmpp_class.require_before_save.must_equal([])
  end
end