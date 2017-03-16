require 'minitest_helper'

describe "#sync_database_pool" do
  let(:connection) do
    Fog::Compute.new(:provider => 'XenServer',
                     :xenserver_url => '192.168.10.2',
                     :xenserver_username => 'root',
                     :xenserver_password => '123456')
  end

  it "should return success" do
    VCR.use_cassette('sync_database_pool') do
      connection.pools.first.sync_database.size.must_equal 0
    end
  end
end