require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Roles do
  let(:roles_class) { Fog::Compute::XenServer::Models::Roles }

  it 'should be a collection of Roles' do
    roles_class.model.must_equal(Fog::Compute::XenServer::Models::Role)
  end
end