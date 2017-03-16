require 'minitest_helper'

describe "#create_vbd" do
  let(:connection) do
    VCR.use_cassette('create_vbd_open_connection') do
      Fog::Compute.new(:provider => 'XenServer',
                       :xenserver_url => '192.168.10.2',
                       :xenserver_username => 'root',
                       :xenserver_password => '123456')
    end
  end
  let(:sr) do
    VCR.use_cassette('create_vbd_get_storage_repository') do
      connection.storage_repositories.get_by_name('Local storage')
    end
  end
  let(:vdi) do
    VCR.use_cassette('create_vbd_create_vdi') do
      connection.vdis.create(:name => 'Craziest Vdi Ever', :storage_repository => sr)
    end
  end
  let(:host) do
    VCR.use_cassette('create_vbd_get_all_hosts') do
      connection.hosts.first
    end
  end
  let(:vm) do
    VCR.use_cassette('create_vbd_create_vm') do
      connection.servers.create(:name => "CrazyName", :affinity => host)
    end
  end

  before :each do
    @vbd = connection.vbds.new
    @vbd.vdi = vdi
    @vbd.vm = vm
    VCR.use_cassette('create_vbd_create_vbd') do
      @vbd.save
    end
  end

  it 'should create a new vbd' do
    @vbd.persisted?.must_equal(true)
  end
end