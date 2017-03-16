require 'minitest_helper'

describe Fog::Compute::XenServer::Models::VifsMetrics do
  let(:vifs_metrics_class) { Fog::Compute::XenServer::Models::VifsMetrics }

  it 'should be a collection of Servers' do
    vifs_metrics_class.model.must_equal(Fog::Compute::XenServer::Models::VifMetrics)
  end
end