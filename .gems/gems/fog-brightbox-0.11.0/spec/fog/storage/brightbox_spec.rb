require "spec_helper"

describe Fog::Storage::Brightbox do
  include StockStorageResponses

  let(:config) { Fog::Brightbox::Config.new(settings) }
  let(:service) { Fog::Storage::Brightbox.new(config) }

  describe "when created without required arguments" do
    it "raises an error" do
      Fog.stub :credentials, {} do
        assert_raises ArgumentError do
          Fog::Storage::Brightbox.new({})
        end
      end
    end
  end

  describe "when created with a Config object" do
    let(:settings) do
      {
        :brightbox_client_id => "cli-12345",
        :brightbox_secret => "1234567890"
      }
    end

    it "does not error" do
      service
      pass
    end
  end

  describe "when created with Config missing required settings" do
    let(:settings) { {} }

    it "raises ArgumentError" do
      assert_raises ArgumentError do
        Fog::Storage::Brightbox.new(config)
      end
    end
  end

  describe "when created with a viable config" do
    let(:settings) do
      {
        :brightbox_client_id => "cli-12345",
        :brightbox_secret => "fdkls"
      }
    end

    before do
      stub_request(:get, "https://orbit.brightbox.com/v1").
        to_return(authorized_response)
    end

    it "requires a call to authenticate" do
      assert service.needs_to_authenticate?
    end

    it "requires a call to discover management_url" do
      assert_nil service.management_url
    end

    it "can authenticate" do
      service.authenticate
      assert_equal "https://orbit.brightbox.com/v1/acc-12345", service.management_url.to_s
    end
  end

  describe "when created with bad credentials" do
    let(:settings) do
      {
        :brightbox_client_id => "cli-12345",
        :brightbox_secret => "wrong"
      }
    end

    it "fails to authenticate" do
      stub_request(:get, "https://orbit.brightbox.com/v1").
        to_return(unauthorized_response)

      assert_raises(Fog::Brightbox::Storage::AuthenticationRequired) { service.authenticate }
      assert_nil service.management_url
    end
  end

  describe "when configured scoped to a specific account" do
    let(:settings) do
      {
        :brightbox_client_id => "app-12345",
        :brightbox_secret => "12345",
        :brightbox_username => "user@example.com",
        :brightbox_password => "abcde",
        :brightbox_account => "acc-abcde"
      }
    end

    before do
      stub_request(:get, "https://orbit.brightbox.com/v1").
        to_return(authorized_response)
    end

    it "uses the configured account" do
      assert service.authenticate
      assert_equal "acc-abcde", service.account
    end
  end

  describe "when account is not configured" do
    let(:settings) do
      {
        :brightbox_client_id => "app-12345",
        :brightbox_secret => "12345",
        :brightbox_username => "user@example.com",
        :brightbox_password => "abcde"
      }
    end

    before do
      stub_request(:get, "https://orbit.brightbox.com/v1").
        to_return(authorized_response)
    end

    it "extracts the account from the management URL" do
      assert service.authenticate
      assert_equal "acc-12345", service.account
    end
  end

  describe "when configured with existing token" do
    let(:settings) do
      {
        :brightbox_client_id => "app-12345",
        :brightbox_secret => "12345",
        :brightbox_access_token => "1234567890abcdefghijklmnopqrstuvwxyz",
        :brightbox_refresh_token => "1234567890abcdefghijklmnopqrstuvwxyz"
      }
    end

    it "does not need to authenticate" do
      refute service.needs_to_authenticate?
    end

    it "requires a call to discover management_url" do
      assert_nil service.management_url
    end
  end

  describe "when configured with tokens and management_url" do
    let(:settings) do
      {
        :brightbox_client_id => "app-12345",
        :brightbox_secret => "12345",
        :brightbox_access_token => "1234567890abcdefghijklmnopqrstuvwxyz",
        :brightbox_refresh_token => "1234567890abcdefghijklmnopqrstuvwxyz",
        :brightbox_storage_management_url => "https://files.gb2.brightbox.com/v1/acc-12345"
      }
    end

    it "does not need to authenticate" do
      refute service.needs_to_authenticate?
    end

    it "uses configured management_url" do
      assert_equal "https://files.gb2.brightbox.com/v1/acc-12345", service.management_url.to_s
    end

    it "keeps setting after authentication" do
      stub_request(:get, "https://orbit.brightbox.com/v1").
        to_return(authorized_response)
      config.expire_tokens!
      service.authenticate
      assert_equal "https://files.gb2.brightbox.com/v1/acc-12345", service.management_url.to_s
    end
  end

  describe "when configured with expired tokens" do
    let(:settings) do
      {
        :brightbox_client_id => "app-12345",
        :brightbox_secret => "12345",
        :brightbox_access_token => "1234567890abcdefghijklmnopqrstuvwxyz",
        :brightbox_refresh_token => "1234567890abcdefghijklmnopqrstuvwxyz",
        :brightbox_storage_management_url => "https://files.gb2.brightbox.com/v1/acc-12345",
        :brightbox_token_management => false
      }
    end

    before do
      # Ongoing request but tokens are expired
      stub_request(:get, "https://files.gb2.brightbox.com/v1/acc-12345/fnord").
        to_return(unauthorized_response)
    end

    let(:params) { { :expects => [200], :path => "fnord" } }

    it "raises Fog::Brightbox::Storage::AuthenticationRequired" do
      assert_raises(Fog::Brightbox::Storage::AuthenticationRequired) { service.request(params) }
    end
  end

  describe "when configured with user details and expired tokens" do
    let(:settings) do
      {
        :brightbox_client_id => "app-12345",
        :brightbox_secret => "12345",
        :brightbox_username => "user@example.com",
        :brightbox_password => "12345",
        :brightbox_access_token => "1234567890abcdefghijklmnopqrstuvwxyz",
        :brightbox_refresh_token => "1234567890abcdefghijklmnopqrstuvwxyz",
        :brightbox_storage_url => "https://files.gb2.brightbox.com",
        :brightbox_storage_management_url => "https://files.gb2.brightbox.com/v1/acc-12345"
      }
    end

    before do
      # Ongoing request but tokens are expired
      stub_request(:get, "https://files.gb2.brightbox.com/v1/acc-12345/fnord").
        with(:headers => { "X-Auth-Token" => "1234567890abcdefghijklmnopqrstuvwxyz" }).
        to_return(unauthorized_response)

      # The reauthentication
      stub_request(:get, "https://files.gb2.brightbox.com/v1").
        with(:headers => { "X-Auth-User" => "user@example.com", "X-Auth-Key" => "12345" }).
        to_return(authorized_response)

      # Repeated request
      stub_request(:get, "https://files.gb2.brightbox.com/v1/acc-12345/fnord").
        with(:headers => { "X-Auth-Token" => "abcdefghijklmnopqrstuvwxyz1234567890" }).
        to_return(:status => 200)
    end

    let(:params) { { :expects => [200], :path => "fnord" } }

    it "authenticates again and retries" do
      service.request(params)
      pass
    end
  end

  describe "when configured with client credentials" do
    let(:settings) do
      {
        :brightbox_client_id => "cli-12345",
        :brightbox_secret => "12345"
      }
    end

    before do
      # Initial authentication
      stub_request(:get, "https://orbit.brightbox.com/v1").
        with(:headers => { "X-Auth-Key" => "12345", "X-Auth-User" => "cli-12345" }).
        to_return(authorized_response)

      stub_request(:get, "https://orbit.brightbox.com/v1/acc-12345/fnord").
        with(:headers => { "X-Auth-Token" => "abcdefghijklmnopqrstuvwxyz1234567890" }).
        to_return(:status => 200)
    end

    let(:params) { { :expects => [200], :path => "fnord" } }

    it "authenticates again and retries" do
      service.request(params)
      pass
    end
  end

  describe "when not initialised with temporary URL key" do
    let(:settings) do
      {
        :brightbox_client_id => "cli-12345",
        :brightbox_secret => "12345"
      }
    end

    it "returns nil" do
      assert_nil config.storage_temp_key
    end

    it "fails to generate temporary URLs" do
      assert_raises(ArgumentError) { service.create_temp_url("container", "object", Time.now, "GET") }
    end
  end

  describe "when initialised with temporary URL key" do
    before { skip unless RUBY_VERSION > "1.9.3" }
    let(:temp_url_key) { "1234567890" }
    let(:settings) do
      {
        :brightbox_client_id => "cli-12345",
        :brightbox_secret => "12345",
        :brightbox_storage_management_url => "https://example.brightbox.com",
        :brightbox_temp_url_key => temp_url_key
      }
    end
    let(:container) { "container" }
    let(:object) { "file.ext" }
    let(:expiry_time) { Time.utc(2012) }
    let(:request_method) { "GET" }

    it "returns the key" do
      assert_equal temp_url_key, config.storage_temp_key
    end

    it "can generate temporary HTTPS URLs" do
      assert_equal "https://example.brightbox.com/container/file.ext?temp_url_sig=86dcfd2cf9d501936abab2badc152e90d6b3b133&temp_url_expires=1325376000",
        service.create_temp_url(container, object, expiry_time, request_method, :scheme => "https")
    end

    it "can generate temporary HTTP URLs" do
      assert_equal "http://example.brightbox.com/container/file.ext?temp_url_sig=86dcfd2cf9d501936abab2badc152e90d6b3b133&temp_url_expires=1325376000",
        service.create_temp_url(container, object, expiry_time, request_method, :scheme => "http")
    end

    it "can generate temporary HTTP URLs on non standard ports" do
      assert_equal "http://example.brightbox.com:401/container/file.ext?temp_url_sig=86dcfd2cf9d501936abab2badc152e90d6b3b133&temp_url_expires=1325376000",
        service.create_temp_url(container, object, expiry_time, request_method, :scheme => "http", :port => 401)
    end
  end
end
