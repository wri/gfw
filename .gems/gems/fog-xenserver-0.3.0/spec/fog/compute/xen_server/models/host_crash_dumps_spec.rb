require 'minitest_helper'

describe Fog::Compute::XenServer::Models::HostCrashDumps do
  let(:host_crash_dumps_class) { Fog::Compute::XenServer::Models::HostCrashDumps }

  it 'should be a collection of HostCrashDumps' do
    host_crash_dumps_class.model.must_equal(Fog::Compute::XenServer::Models::HostCrashDump)
  end
end