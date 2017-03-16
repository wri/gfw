require 'minitest_helper'
require 'xmlrpc/datetime'

describe Fog::Compute::XenServer::Models::VbdMetrics do
  let(:vbd_metrics_class) do
    class Fog::Compute::XenServer::Models::VbdMetrics
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::VbdMetrics
  end
  let(:vbd_metrics) { Fog::Compute::XenServer::Models::VbdMetrics.new }

  it 'should associate to a provider class' do
    vbd_metrics_class.provider_class.must_equal('VBD_metrics')
  end

  it 'should have a collection name' do
    vbd_metrics_class.collection_name.must_equal(:vbds_metrics)
  end

  it 'should have an unique id' do
    vbd_metrics_class.read_identity.must_equal(:reference)
  end

  it 'should have 6 attributes' do
    vbd_metrics_class.attributes.must_equal([ :reference,
                                              :io_read_kbs,
                                              :io_write_kbs,
                                              :last_updated,
                                              :other_config,
                                              :uuid ])
  end

  it "shouldn't have associations" do
    vbd_metrics_class.associations.must_equal({})
  end

  it 'should have 6 masks' do
    vbd_metrics_class.masks.must_equal(:reference => :reference, 
                                       :io_read_kbs => :io_read_kbs, 
                                       :io_write_kbs => :io_write_kbs, 
                                       :last_updated => :last_updated, 
                                       :other_config => :other_config, 
                                       :uuid => :uuid)
  end

  it "should't have aliases" do
    vbd_metrics_class.aliases.must_equal({})
  end

  it "shouldn't have default values" do
    vbd_metrics_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    vbd_metrics_class.require_before_save.must_equal([])
  end

  describe '#last_updated' do
    before :each do
      vbd_metrics.last_updated = XMLRPC::DateTime.new(2000, 7, 8, 10, 20, 34)
    end

    it  'should be an instance of Time' do
      vbd_metrics.last_updated.must_be_instance_of(Time)
    end
  end
end