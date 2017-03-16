require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Servers do
  let(:servers_class) { Fog::Compute::XenServer::Models::Servers }

  it 'should be a collection of Servers' do
    servers_class.model.must_equal(Fog::Compute::XenServer::Models::Server)
  end
end