require 'minitest_helper'

describe Fog::Compute::XenServer::Models::GuestsMetrics do
  let(:guests_metrics_class) { Fog::Compute::XenServer::Models::GuestsMetrics }

  it 'should be a collection of GuestsMetrics' do
    guests_metrics_class.model.must_equal(Fog::Compute::XenServer::Models::GuestMetrics)
  end
end