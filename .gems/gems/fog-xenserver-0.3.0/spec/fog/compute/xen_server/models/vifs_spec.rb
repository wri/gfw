require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Vifs do
  let(:vifs_class) { Fog::Compute::XenServer::Models::Vifs }

  it 'should be a collection of Servers' do
    vifs_class.model.must_equal(Fog::Compute::XenServer::Models::Vif)
  end
end