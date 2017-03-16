require 'minitest_helper'

describe Fog::Compute::XenServer::Models::StorageRepositories do
  let(:storage_repositories_class) { Fog::Compute::XenServer::Models::StorageRepositories }

  it 'should be a collection of StorageRepositories' do
    storage_repositories_class.model.must_equal(Fog::Compute::XenServer::Models::StorageRepository)
  end
end