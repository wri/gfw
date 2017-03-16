require 'minitest_helper'

describe "#clone_vm" do
  let(:connection) do
    VCR.use_cassette('open_connection') do
      Fog::Compute.new(:provider => 'XenServer',
                       :xenserver_url => '192.168.10.2',
                       :xenserver_username => 'root',
                       :xenserver_password => '123456')
    end
  end
  let(:server) do
    host = VCR.use_cassette('create_server_get_all_hosts') do
      connection.hosts.first
    end
    @server = connection.servers.new(:name => 'CrazyName')
    @server.affinity = host
    VCR.use_cassette('create_server_create_vm') do
      @server.save
    end
    @server
  end

  before :each do
    @template_uuid = server.uuid
    VCR.use_cassette('clone_server') do
      server.clone('Awesome Server')
    end
  end

  it 'should create a new template' do
    server.persisted?.must_equal(true)
    server.uuid.wont_equal(@template_uuid)
    server.name.must_equal('Awesome Server')
  end
end