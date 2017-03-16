require 'minitest_helper'

describe Fog::Compute::XenServer::Models::VbdsMetrics do
  let(:vbds_metrics_class) { Fog::Compute::XenServer::Models::VbdsMetrics }

  it 'should be a collection of Servers' do
    vbds_metrics_class.model.must_equal(Fog::Compute::XenServer::Models::VbdMetrics)
  end
end