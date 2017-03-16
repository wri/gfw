require 'minitest_helper'

describe "#create_vm" do
  let(:connection) do
    VCR.use_cassette('create_server_open_connection') do
      Fog::Compute.new(:provider => 'XenServer',
                       :xenserver_url => '192.168.10.2',
                       :xenserver_username => 'root',
                       :xenserver_password => '123456')
    end
  end
  let(:host) do
    VCR.use_cassette('create_server_get_all_hosts') do
      connection.hosts.first
    end
  end

  before :each do
    @server = connection.servers.new(:name => 'CrazyName')
    @server.affinity = host
    VCR.use_cassette('create_server_create_vm') do
      @server.save
    end
  end

  it 'should create a new server' do
    @server.persisted?.must_equal(true)
    @server.name.must_equal('CrazyName')
  end
end