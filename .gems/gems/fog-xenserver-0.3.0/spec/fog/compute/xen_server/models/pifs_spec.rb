require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Pifs do
  let(:pifs_class) { Fog::Compute::XenServer::Models::Pifs }

  it 'should be a collection of Pifs' do
    pifs_class.model.must_equal(Fog::Compute::XenServer::Models::Pif)
  end
end