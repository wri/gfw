require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Vbds do
  let(:vbds_class) { Fog::Compute::XenServer::Models::Vbds }

  it 'should be a collection of Servers' do
    vbds_class.model.must_equal(Fog::Compute::XenServer::Models::Vbd)
  end
end