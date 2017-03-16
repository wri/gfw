require 'minitest_helper'

describe "#create_vdi" do
  let(:connection) do
    VCR.use_cassette('open_connection') do
      Fog::Compute.new(:provider => 'XenServer',
                       :xenserver_url => '192.168.10.2',
                       :xenserver_username => 'root',
                       :xenserver_password => '123456')
    end
  end
  let(:sr) do
    VCR.use_cassette('get_storage_repository') do
      connection.storage_repositories.get_by_name('Local storage')
    end
  end

  before :each do
    VCR.use_cassette('create_vdi') do
      @vdi = connection.vdis.create(:name => 'Craziest Vdi Ever', :storage_repository => sr)
    end
  end

  it 'should create a new vdi' do
    @vdi.persisted?.must_equal(true)
  end
end