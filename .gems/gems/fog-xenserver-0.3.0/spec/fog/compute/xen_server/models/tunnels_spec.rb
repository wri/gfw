require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Tunnels do
  let(:tunnels_class) { Fog::Compute::XenServer::Models::Tunnels }

  it 'should be a collection of Servers' do
    tunnels_class.model.must_equal(Fog::Compute::XenServer::Models::Tunnel)
  end
end