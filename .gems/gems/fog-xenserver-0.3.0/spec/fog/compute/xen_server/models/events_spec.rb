require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Events do
  let(:events_class) { Fog::Compute::XenServer::Models::Events }

  it 'should be a collection of Blobs' do
    events_class.model.must_equal(Fog::Compute::XenServer::Models::Event)
  end
end