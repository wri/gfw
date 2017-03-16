require 'minitest_helper'

describe Fog::Compute::XenServer::Models::ServerAppliances do
  let(:server_appliances_class) { Fog::Compute::XenServer::Models::ServerAppliances }

  it 'should be a collection of ServerAppliances' do
    server_appliances_class.model.must_equal(Fog::Compute::XenServer::Models::ServerAppliance)
  end
end