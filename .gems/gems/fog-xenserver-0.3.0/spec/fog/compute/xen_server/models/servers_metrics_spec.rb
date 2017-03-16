require 'minitest_helper'

describe Fog::Compute::XenServer::Models::ServersMetrics do
  let(:servers_metrics_class) { Fog::Compute::XenServer::Models::ServersMetrics }

  it 'should be a collection of ServersMetrics' do
    servers_metrics_class.model.must_equal(Fog::Compute::XenServer::Models::ServerMetrics)
  end
end