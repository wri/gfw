require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Consoles do
  let(:consoles_class) { Fog::Compute::XenServer::Models::Consoles }

  it 'should be a collection of Consoles' do
    consoles_class.model.must_equal(Fog::Compute::XenServer::Models::Console)
  end
end