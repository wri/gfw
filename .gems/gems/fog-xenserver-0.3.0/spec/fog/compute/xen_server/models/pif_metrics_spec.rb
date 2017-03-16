require 'minitest_helper'

describe Fog::Compute::XenServer::Models::PifMetrics do
  let(:pif_metrics_class) do
    class Fog::Compute::XenServer::Models::PifMetrics
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::PifMetrics
  end

  it 'should associate to a provider class' do
    pif_metrics_class.provider_class.must_equal('PIF_metrics')
  end

  it 'should have a collection name' do
    pif_metrics_class.collection_name.must_equal(:pifs_metrics)
  end

  it 'should have an unique id' do
    pif_metrics_class.read_identity.must_equal(:reference)
  end

  it 'should have 14 attributes' do
    pif_metrics_class.attributes.must_equal([ :reference,
                                              :carrier,
                                              :device_id,
                                              :device_name,
                                              :duplex,
                                              :io_read_kbs,
                                              :io_write_kbs,
                                              :last_updated,
                                              :other_config,
                                              :pci_bus_path,
                                              :speed,
                                              :uuid,
                                              :vendor_id,
                                              :vendor_name ])
  end

  it "shouldn't have associations" do
    pif_metrics_class.associations.must_equal({})
  end

  it 'should have 14 masks' do
    pif_metrics_class.masks.must_equal(:reference => :reference, 
                                       :carrier => :carrier, 
                                       :device_id => :device_id, 
                                       :device_name => :device_name, 
                                       :duplex => :duplex, 
                                       :io_read_kbs => :io_read_kbs, 
                                       :io_write_kbs => :io_write_kbs, 
                                       :last_updated => :last_updated, 
                                       :other_config => :other_config, 
                                       :pci_bus_path => :pci_bus_path, 
                                       :speed => :speed, 
                                       :uuid => :uuid, 
                                       :vendor_id => :vendor_id, 
                                       :vendor_name => :vendor_name)
  end

  it "shouldn't have aliases" do
    pif_metrics_class.aliases.must_equal({})
  end

  it "shouldn't have default values" do
    pif_metrics_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    pif_metrics_class.require_before_save.must_equal([])
  end
end