require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Hosts do
  let(:hosts_class) { Fog::Compute::XenServer::Models::Hosts }

  it 'should be a collection of Hosts' do
    hosts_class.model.must_equal(Fog::Compute::XenServer::Models::Host)
  end
end