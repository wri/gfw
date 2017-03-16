require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Bonds do
  let(:bonds_class) { Fog::Compute::XenServer::Models::Bonds }

  it 'should be a collection of Bonds' do
    bonds_class.model.must_equal(Fog::Compute::XenServer::Models::Bond)
  end
end