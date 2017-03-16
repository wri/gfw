require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Vmpps do
  let(:vmpps_class) { Fog::Compute::XenServer::Models::Vmpps }

  it 'should be a collection of Servers' do
    vmpps_class.model.must_equal(Fog::Compute::XenServer::Models::Vmpp)
  end
end