require "minitest/autorun"
require "webmock/minitest"
require "fog/brightbox"

describe Fog::Brightbox::Storage::Connection do
  let(:config) { Fog::Brightbox::Config.new(settings) }
  let(:connection) { Fog::Brightbox::Storage::Connection.new(config) }
  let(:params) do
    { :path => "fnord", :expects => [200] }
  end
  let(:settings) do
    {
      :brightbox_client_id => "app-12345",
      :brightbox_secret => "1234567890",
      :brightbox_storage_management_url => "https://files.gb2.brightbox.com/v1/acc-12345"
    }
  end
  let(:valid_auth_token) { "01234567890abcdefghijklmnopqrstuvwxyz" }

  describe "when management URL is not available" do
    let(:settings) do
      {
        :brightbox_client_id => "app-12345",
        :brightbox_secret => "1234567890"
      }
    end

    it "raises Fog::Brightbox::Storage::ManagementUrlUnknown" do
      assert_raises(Fog::Brightbox::Storage::ManagementUrlUnknown) { connection.request(params) }
    end
  end

  describe "when parameters are nil" do
    let(:params) {}

    it "raises ArgumentError" do
      assert_raises(ArgumentError) { connection.request(params) }
    end
  end

  describe "when parameters are empty" do
    let(:params) { {} }

    before do
      stub_request(:get, "https://files.gb2.brightbox.com/v1/acc-12345").
        with(:headers => {
               "Accept" => "application/json",
               "Content-Type" => "application/json",
               "X-Auth-Token" => valid_auth_token
             }).to_return(:status => 200, :body => "{}", :headers => {
                            "Content-Type" => "application/json"
                          })
    end

    it "completes successfully" do
      config.stub :latest_access_token, valid_auth_token do
        connection.request(params)
        pass
      end
    end
  end

  describe "when request should succeed" do
    before do
      stub_request(:get, "https://files.gb2.brightbox.com/v1/acc-12345/fnord").
        with(:headers => {
               "Accept" => "application/json",
               "Content-Type" => "application/json",
               "X-Auth-Token" => valid_auth_token
             }).to_return(:status => 200, :body => "{}", :headers => {
                            "Content-Type" => "application/json"
                          })
    end

    it "completes successfully" do
      config.stub :latest_access_token, valid_auth_token do
        connection.request(params)
        pass
      end
    end
  end

  describe "when custom headers are passed" do
    let(:params) do
      { :headers => { "X-Test" => "present" }, :path => "fnord" }
    end

    it "completes successfully" do
      stub_request(:get, "https://files.gb2.brightbox.com/v1/acc-12345/fnord").
        with(:headers => { "X-Test" => "present" }).to_return(:status => 200)

      connection.request(params)
      pass
    end
  end

  describe "when container is not found" do
    it "raises Fog::Storage::Brightbox::NotFound" do
      stub_request(:get, "https://files.gb2.brightbox.com/v1/acc-12345/fnord").
        to_return(:status => 404,
                  :body => "<html><h1>Not Found</h1><p>The resource could not be found.</p></html>",
                  :headers => {
                    "Content-Type" => "text/html"
                  })
      assert_raises(Fog::Storage::Brightbox::NotFound) { connection.request(params) }
    end
  end

  describe "when request is not authenticated" do
    it "raises Fog::Brightbox::Storage::AuthenticationRequired" do
      stub_request(:get, "https://files.gb2.brightbox.com/v1/acc-12345/fnord").
        to_return(:status => 401,
                  :body => "Authentication required",
                  :headers => {
                    "Content-Type" => "text/plain"
                  })
      assert_raises(Fog::Brightbox::Storage::AuthenticationRequired) { connection.request(params) }
    end
  end
end
