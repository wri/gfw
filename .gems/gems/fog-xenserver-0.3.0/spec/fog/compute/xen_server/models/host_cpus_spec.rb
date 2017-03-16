require 'minitest_helper'

describe Fog::Compute::XenServer::Models::HostCpus do
  let(:host_cpus_class) { Fog::Compute::XenServer::Models::HostCpus }

  it 'should be a collection of HostsCpus' do
    host_cpus_class.model.must_equal(Fog::Compute::XenServer::Models::HostCpu)
  end
end