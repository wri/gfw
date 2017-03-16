require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Vtpms do
  let(:vtpms_class) { Fog::Compute::XenServer::Models::Vtpms }

  it 'should be a collection of Servers' do
    vtpms_class.model.must_equal(Fog::Compute::XenServer::Models::Vtpm)
  end
end