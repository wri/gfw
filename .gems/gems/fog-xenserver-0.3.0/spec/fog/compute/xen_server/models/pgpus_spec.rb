require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Pgpus do
  let(:pgpus_class) { Fog::Compute::XenServer::Models::Pgpus }

  it 'should be a collection of Pgpus' do
    pgpus_class.model.must_equal(Fog::Compute::XenServer::Models::Pgpu)
  end
end