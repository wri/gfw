require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Pbds do
  let(:pbds_class) { Fog::Compute::XenServer::Models::Pbds }

  it 'should be a collection of Pbds' do
    pbds_class.model.must_equal(Fog::Compute::XenServer::Models::Pbd)
  end
end