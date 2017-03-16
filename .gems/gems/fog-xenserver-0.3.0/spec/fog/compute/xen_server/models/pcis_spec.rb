require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Pcis do
  let(:pcis_class) { Fog::Compute::XenServer::Models::Pcis }

  it 'should be a collection of Pcis' do
    pcis_class.model.must_equal(Fog::Compute::XenServer::Models::Pci)
  end
end