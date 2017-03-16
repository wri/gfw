require 'minitest_helper'

describe Fog::Compute::XenServer::Models::GpuGroups do
  let(:gpu_groups_class) { Fog::Compute::XenServer::Models::GpuGroups }

  it 'should be a collection of GpuGroups' do
    gpu_groups_class.model.must_equal(Fog::Compute::XenServer::Models::GpuGroup)
  end
end