require 'minitest_helper'

describe Fog::Compute::XenServer::Models::StorageManagers do
  let(:storage_managers_class) { Fog::Compute::XenServer::Models::StorageManagers }

  it 'should be a collection of StorageManagers' do
    storage_managers_class.model.must_equal(Fog::Compute::XenServer::Models::StorageManager)
  end
end