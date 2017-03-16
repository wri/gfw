require 'minitest_helper'

describe Fog::Compute::XenServer::Models::HostCpu do
  let(:host_cpu_class) do
    class Fog::Compute::XenServer::Models::HostCpu
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::HostCpu
  end

  it 'should associate to a provider class' do
    host_cpu_class.provider_class.must_equal('host_cpu')
  end

  it 'should have a collection name' do
    host_cpu_class.collection_name.must_equal(:host_cpus)
  end

  it 'should have an unique id' do
    host_cpu_class.read_identity.must_equal(:reference)
  end

  it 'should have 13 attributes' do
    host_cpu_class.attributes.must_equal([ :reference,
                                           :family,
                                           :features,
                                           :flags,
                                           :model,
                                           :model_name,
                                           :number,
                                           :other_config,
                                           :speed,
                                           :stepping,
                                           :utilisation,
                                           :uuid,
                                           :vendor ])
  end

  it 'should have 1 association' do
    host_cpu_class.associations.must_equal(:host => :hosts)
  end

  it 'should have 14 masks' do
    host_cpu_class.masks.must_equal(:reference => :reference, 
                                    :family => :family, 
                                    :features => :features, 
                                    :flags => :flags, 
                                    :model => :model, 
                                    :model_name => :modelname, 
                                    :number => :number, 
                                    :other_config => :other_config, 
                                    :speed => :speed, 
                                    :stepping => :stepping, 
                                    :utilisation => :utilisation, 
                                    :uuid => :uuid, 
                                    :vendor => :vendor, 
                                    :host => :host)
  end

  it 'should have 1 alias' do
    host_cpu_class.aliases.must_equal(:modelname => :model_name)
  end

  it "shouldn't have default values" do
    host_cpu_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    host_cpu_class.require_before_save.must_equal([])
  end
end