require 'minitest_helper'
require 'xmlrpc/datetime'

describe Fog::Compute::XenServer::Models::HostMetrics do
  let(:host_metrics_class) do
    class Fog::Compute::XenServer::Models::HostMetrics
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::HostMetrics
  end
  let(:host_metrics) { Fog::Compute::XenServer::Models::HostMetrics.new }

  it 'should associate to a provider class' do
    host_metrics_class.provider_class.must_equal('host_metrics')
  end

  it 'should have a collection name' do
    host_metrics_class.collection_name.must_equal(:hosts_metrics)
  end

  it 'should have an unique id' do
    host_metrics_class.read_identity.must_equal(:reference)
  end

  it 'should have 7 attributes' do
    host_metrics_class.attributes.must_equal([ :reference,
                                               :last_updated,
                                               :live,
                                               :memory_free,
                                               :memory_total,
                                               :other_config,
                                               :uuid ])
  end

  it "shouldn't have associations" do
    host_metrics_class.associations.must_equal({})
  end

  it 'should have 7 masks' do
    host_metrics_class.masks.must_equal(:reference => :reference, 
                                        :last_updated => :last_updated, 
                                        :live => :live, 
                                        :memory_free => :memory_free, 
                                        :memory_total => :memory_total, 
                                        :other_config => :other_config, 
                                        :uuid => :uuid)
  end

  it "shouldn't have aliases" do
    host_metrics_class.aliases.must_equal({})
  end

  it "shouldn't have default values" do
    host_metrics_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    host_metrics_class.require_before_save.must_equal([])
  end

  describe '#last_updated' do
    before :each do
      host_metrics.last_updated = XMLRPC::DateTime.new(2000, 7, 8, 10, 20, 34)
    end

    it  'should be an instance of Time' do
      host_metrics.last_updated.must_be_instance_of(Time)
    end
  end
end