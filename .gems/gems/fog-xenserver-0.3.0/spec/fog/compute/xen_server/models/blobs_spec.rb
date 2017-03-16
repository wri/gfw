require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Blobs do
  let(:blobs_class) { Fog::Compute::XenServer::Models::Blobs }

  it 'should be a collection of Blobs' do
    blobs_class.model.must_equal(Fog::Compute::XenServer::Models::Blob)
  end
end