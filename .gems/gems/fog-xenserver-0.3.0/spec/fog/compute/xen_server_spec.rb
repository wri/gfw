require 'minitest_helper'

describe Fog::Compute::XenServer do
  describe '.const_missing' do
    before :each do
      Fog::Compute::XenServer::Models::Abc = Class.new
    end

    it 'should look for missing constants in the Models namespace' do
      Fog::Compute::XenServer::Abc.must_equal Fog::Compute::XenServer::Models::Abc
    end
  end
end