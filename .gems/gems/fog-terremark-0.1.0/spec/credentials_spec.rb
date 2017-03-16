require "minitest_helper"

describe Fog::Terremark::Vcloud do

  it "gets a login token" do
    VCR.use_cassette("get_login_token") do
      service = Fog::Terremark::Vcloud.new(
        :terremark_vcloud_username => "test@example.com",
        :terremark_vcloud_password => "123456")
      service.send(:auth_token)
    end
  end

end
