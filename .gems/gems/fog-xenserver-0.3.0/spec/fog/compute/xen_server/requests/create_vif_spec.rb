require 'minitest_helper'

describe "#create_vif" do
  let(:connection) do
    VCR.use_cassette('create_vif_open_connection') do
      Fog::Compute.new(:provider => 'XenServer',
                       :xenserver_url => '192.168.10.2',
                       :xenserver_username => 'root',
                       :xenserver_password => '123456')
    end
  end
  let(:network) do
    VCR.use_cassette('create_vif_get_network_by_name') do
      connection.networks.get_by_name('Pool-wide network associated with eth0')
    end
  end
  let(:host) do
    VCR.use_cassette('create_server_get_all_hosts') do
      connection.hosts.first
    end
  end
  let(:vm) do
    @server = connection.servers.new(:name => 'CrazyName')
    @server.affinity = host
    VCR.use_cassette('create_server_create_vm') do
      @server.save
    end
    @server
  end

  before :each do
    @vif = connection.vifs.new
    @vif.network = network
    @vif.vm = vm
    VCR.use_cassette('create_vif_vif_set_device_number') do
      @vif.set_device_number
    end
    VCR.use_cassette('create_vif_create_vif') do
      @vif.save
    end
  end

  it 'should create a new vif' do
    @vif.persisted?.must_equal(true)
  end
end