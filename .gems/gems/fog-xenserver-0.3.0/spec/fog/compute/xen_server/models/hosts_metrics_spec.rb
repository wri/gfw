require 'minitest_helper'

describe Fog::Compute::XenServer::Models::HostsMetrics do
  let(:hosts_metrics_class) { Fog::Compute::XenServer::Models::HostsMetrics }

  it 'should be a collection of HostsMetrics' do
    hosts_metrics_class.model.must_equal(Fog::Compute::XenServer::Models::HostMetrics)
  end
end