require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Pools do
  let(:pools_class) { Fog::Compute::XenServer::Models::Pools }

  it 'should be a collection of Pools' do
    pools_class.model.must_equal(Fog::Compute::XenServer::Models::Pool)
  end
end