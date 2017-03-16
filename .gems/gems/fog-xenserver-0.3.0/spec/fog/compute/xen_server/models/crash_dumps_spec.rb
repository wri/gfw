require 'minitest_helper'

describe Fog::Compute::XenServer::Models::CrashDumps do
  let(:crash_dumps_class) { Fog::Compute::XenServer::Models::CrashDumps }

  it 'should be a collection of CrashDumps' do
    crash_dumps_class.model.must_equal(Fog::Compute::XenServer::Models::CrashDump)
  end
end