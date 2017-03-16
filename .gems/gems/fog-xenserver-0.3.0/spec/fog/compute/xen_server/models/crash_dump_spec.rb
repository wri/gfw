require 'minitest_helper'

describe Fog::Compute::XenServer::Models::CrashDump do
  let(:crash_dump_class) do
    class Fog::Compute::XenServer::Models::CrashDump
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::CrashDump
  end

  it 'should associate to a provider class' do
    crash_dump_class.provider_class.must_equal('crashdump')
  end

  it 'should have a collection name' do
    crash_dump_class.collection_name.must_equal(:crash_dumps)
  end

  it 'should have an unique id' do
    crash_dump_class.read_identity.must_equal(:reference)
  end

  it 'should have 3 attributes' do
    crash_dump_class.attributes.must_equal([ :reference,
                                             :other_config,
                                             :uuid ])
  end

  it 'should have 2 associations' do
    crash_dump_class.associations.must_equal(:vdi => :vdis,
                                             :vm => :servers)
  end

  it 'should have 5 masks' do
    crash_dump_class.masks.must_equal(:reference => :reference,
                                      :other_config => :other_config, 
                                      :uuid => :uuid, 
                                      :vdi => :VDI, 
                                      :vm => :VM)
  end

  it 'should have 2 aliases' do
    crash_dump_class.aliases.must_equal(:VDI => :vdi,
                                        :VM => :vm)
  end

  it "shouldn't have default values" do
    crash_dump_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    crash_dump_class.require_before_save.must_equal([])
  end
end