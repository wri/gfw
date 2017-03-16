require 'minitest_helper'

describe Fog::Compute::XenServer::Models::PifsMetrics do
  let(:pifs_metrics_class) { Fog::Compute::XenServer::Models::PifsMetrics }

  it 'should be a collection of PifsMetrics' do
    pifs_metrics_class.model.must_equal(Fog::Compute::XenServer::Models::PifMetrics)
  end
end