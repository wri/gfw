require 'minitest_helper'

describe Fog::Compute::XenServer::Models::HostCrashDump do
  let(:host_crash_dump_class) do
    class Fog::Compute::XenServer::Models::HostCrashDump
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::HostCrashDump
  end

  it 'should associate to a provider class' do
    host_crash_dump_class.provider_class.must_equal('host_crashdump')
  end

  it 'should have a collection name' do
    host_crash_dump_class.collection_name.must_equal(:host_crash_dumps)
  end

  it 'should have an unique id' do
    host_crash_dump_class.read_identity.must_equal(:reference)
  end

  it 'should have 5 attributes' do
    host_crash_dump_class.attributes.must_equal([ :reference,
                                                  :other_config,
                                                  :size,
                                                  :timestamp,
                                                  :uuid ])
  end

  it 'should have 1 association' do
    host_crash_dump_class.associations.must_equal(:host => :hosts)
  end

  it 'should have 6 masks' do
    host_crash_dump_class.masks.must_equal(:reference => :reference, 
                                           :other_config => :other_config, 
                                           :size => :size, 
                                           :timestamp => :timestamp, 
                                           :uuid => :uuid, 
                                           :host => :host)
  end

  it "shouldn't have aliases" do
    host_crash_dump_class.aliases.must_equal({})
  end

  it "shouldn't have default values" do
    host_crash_dump_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    host_crash_dump_class.require_before_save.must_equal([])
  end
end