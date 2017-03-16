require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Networks do
  let(:networks_class) { Fog::Compute::XenServer::Models::Networks }

  it 'should be a collection of Networks' do
    networks_class.model.must_equal(Fog::Compute::XenServer::Models::Network)
  end
end