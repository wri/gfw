require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Vlans do
  let(:vlans_class) { Fog::Compute::XenServer::Models::Vlans }

  it 'should be a collection of Servers' do
    vlans_class.model.must_equal(Fog::Compute::XenServer::Models::Vlan)
  end
end