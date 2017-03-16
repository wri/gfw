require 'minitest_helper'

describe Fog::Compute::XenServer::Models::GuestMetrics do
  let(:guest_metrics_class) do
    class Fog::Compute::XenServer::Models::GuestMetrics
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::GuestMetrics
  end

  it 'should associate to a provider class' do
    guest_metrics_class.provider_class.must_equal('VM_guest_metrics')
  end

  it 'should have a collection name' do
    guest_metrics_class.collection_name.must_equal(:guests_metrics)
  end

  it 'should have an unique id' do
    guest_metrics_class.read_identity.must_equal(:reference)
  end

  it 'should have 12 attributes' do
    guest_metrics_class.attributes.must_equal([ :reference,
                                                :disk,
                                                :last_updated,
                                                :live,
                                                :memory,
                                                :networks,
                                                :os_version,
                                                :other,
                                                :other_config,
                                                :pv_drivers_up_to_date,
                                                :pv_drivers_version,
                                                :uuid ])
  end

  it "shouldn't have  associations" do
    guest_metrics_class.associations.must_equal({})
  end

  it 'should have 12 masks' do
    guest_metrics_class.masks.must_equal(:reference => :reference,
                                         :disk => :disk, 
                                         :last_updated => :last_updated, 
                                         :live => :live, 
                                         :memory => :memory, 
                                         :networks => :networks, 
                                         :os_version => :os_version, 
                                         :other => :other, 
                                         :other_config => :other_config, 
                                         :pv_drivers_up_to_date => :PV_drivers_up_to_date, 
                                         :pv_drivers_version => :PV_drivers_version, 
                                         :uuid => :uuid)
  end

  it 'should have 2 aliases' do
    guest_metrics_class.aliases.must_equal({ :PV_drivers_up_to_date => :pv_drivers_up_to_date,
                                             :PV_drivers_version => :pv_drivers_version })
  end

  it "shouldn't have default values" do
    guest_metrics_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    guest_metrics_class.require_before_save.must_equal([])
  end
end