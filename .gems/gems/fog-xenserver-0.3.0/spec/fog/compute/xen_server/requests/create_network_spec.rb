require 'minitest_helper'

describe "#create_network" do
  let(:connection) do
    VCR.use_cassette('open_connection') do
      Fog::Compute.new(:provider => 'XenServer',
                       :xenserver_url => '192.168.10.2',
                       :xenserver_username => 'root',
                       :xenserver_password => '123456')
    end
  end

  before :each do
    @network = connection.networks.new(:name => 'CrazyName')
    VCR.use_cassette('create_network') do
      @network.save
    end
  end

  it 'should create a new network' do
    @network.persisted?.must_equal(true)
    @network.name.must_equal('CrazyName')
  end
end