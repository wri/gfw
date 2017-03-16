require 'minitest_helper'

describe Fog::Compute::XenServer::Models::ServerMetrics do
  let(:server_metrics_class) do
    class Fog::Compute::XenServer::Models::ServerMetrics
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::ServerMetrics
  end

  it 'should associate to a provider class' do
    server_metrics_class.provider_class.must_equal('VM_metrics')
  end

  it 'should have a collection name' do
    server_metrics_class.collection_name.must_equal(:servers_metrics)
  end

  it 'should have an unique id' do
    server_metrics_class.read_identity.must_equal(:reference)
  end

  it 'should have 13 attributes' do
    server_metrics_class.attributes.must_equal([ :reference,
                                                 :install_time,
                                                 :last_updated,
                                                 :memory_actual,
                                                 :other_config,
                                                 :start_time,
                                                 :state,
                                                 :uuid,
                                                 :vcpus_cpu,
                                                 :vcpus_flags,
                                                 :vcpus_number,
                                                 :vcpus_params,
                                                 :vcpus_utilisation ])
  end

  it "shouldn't have associations" do
    server_metrics_class.associations.must_equal({})
  end

  it 'should have 13 masks' do
    server_metrics_class.masks.must_equal(:reference => :reference,
                                          :install_time => :install_time,
                                          :last_updated => :last_updated,
                                          :memory_actual => :memory_actual,
                                          :other_config => :other_config,
                                          :start_time => :start_time,
                                          :state => :state,
                                          :uuid => :uuid,
                                          :vcpus_cpu => :VCPUs_CPU,
                                          :vcpus_flags => :VCPUs_flags,
                                          :vcpus_number => :VCPUs_number,
                                          :vcpus_params => :VCPUs_params,
                                          :vcpus_utilisation => :VCPUs_utilisation)
  end

  it 'should have 6 aliases' do
    server_metrics_class.aliases.must_equal(:VCPUs_CPU => :vcpus_cpu,
                                            :VCPUs_flags => :vcpus_flags,
                                            :VCPUs_number => :vcpus_number,
                                            :VCPUs_params => :vcpus_params,
                                            :VCPUs_utilisation => :vcpus_utilisation)
  end

  it "shouldn't have default values" do
    server_metrics_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    server_metrics_class.require_before_save.must_equal([])
  end
end