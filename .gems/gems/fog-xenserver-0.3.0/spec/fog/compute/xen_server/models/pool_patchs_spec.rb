require 'minitest_helper'

describe Fog::Compute::XenServer::Models::PoolPatchs do
  let(:pool_patchs_class) { Fog::Compute::XenServer::Models::PoolPatchs }

  it 'should be a collection of PoolPatchs' do
    pool_patchs_class.model.must_equal(Fog::Compute::XenServer::Models::PoolPatch)
  end
end