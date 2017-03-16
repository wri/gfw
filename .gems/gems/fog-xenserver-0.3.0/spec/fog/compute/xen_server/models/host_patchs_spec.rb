require 'minitest_helper'

describe Fog::Compute::XenServer::Models::HostPatchs do
  let(:host_patchs_class) { Fog::Compute::XenServer::Models::HostPatchs }

  it 'should be a collection of HostPatchs' do
    host_patchs_class.model.must_equal(Fog::Compute::XenServer::Models::HostPatch)
  end
end