require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Vdis do
  let(:vdis_class) { Fog::Compute::XenServer::Models::Vdis }

  it 'should be a collection of Servers' do
    vdis_class.model.must_equal(Fog::Compute::XenServer::Models::Vdi)
  end
end