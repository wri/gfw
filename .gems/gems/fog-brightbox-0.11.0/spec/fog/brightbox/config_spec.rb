require "spec_helper"

describe Fog::Brightbox::Config do
  it "can be used to config services" do
    @config = Fog::Brightbox::Config.new
    assert @config.config_service?
  end

  describe "when created with Fog.credentials" do
    it "does not error" do
      @config = Fog::Brightbox::Config.new(Fog.credentials)
      assert_instance_of Fog::Brightbox::Config, @config
    end
  end

  describe "when created with a Hash" do
    it "does not error" do
      @options = {
        :brightbox_client_id => "cli-12345"
      }
      @config = Fog::Brightbox::Config.new(@options)
      assert_instance_of Fog::Brightbox::Config, @config
    end
  end

  describe "when auth url options was passed" do
    it "returns the setting" do
      @options = { :brightbox_auth_url => "https://api.gb1.brightbox.com" }
      @config = Fog::Brightbox::Config.new(@options)
      assert_instance_of URI::HTTPS, @config.auth_url
    end
  end

  describe "when auth url is not specified" do
    it "returns the default" do
      @config = Fog::Brightbox::Config.new({})
      assert_instance_of URI::HTTPS, @config.auth_url
      assert_equal "https://api.gb1.brightbox.com", @config.auth_url.to_s
    end
  end

  describe "when compute url options was passed" do
    it "returns the setting" do
      @options = { :brightbox_api_url => "https://api.gb1.brightbox.com" }
      @config = Fog::Brightbox::Config.new(@options)
      assert_instance_of URI::HTTPS, @config.compute_url
      assert_equal @config.compute_url, @config.api_url
    end
  end

  describe "when compute url is not specified" do
    it "returns the default" do
      @config = Fog::Brightbox::Config.new({})
      assert_instance_of URI::HTTPS, @config.compute_url
      assert_equal "https://api.gb1.brightbox.com", @config.compute_url.to_s
      assert_equal @config.compute_url, @config.api_url
    end
  end

  describe "when client id is passed" do
    it "returns the settings" do
      @options = { :brightbox_client_id => "cli-12345" }
      @config = Fog::Brightbox::Config.new(@options)
      assert_equal "cli-12345", @config.client_id
    end
  end

  describe "when client secret is passed" do
    it "returns the settings" do
      @options = { :brightbox_secret => "secret" }
      @config = Fog::Brightbox::Config.new(@options)
      assert_equal "secret", @config.client_secret
    end
  end

  describe "when username is passed" do
    it "returns the settings" do
      @options = { :brightbox_username => "usr-12345" }
      @config = Fog::Brightbox::Config.new(@options)
      assert_equal "usr-12345", @config.username
    end
  end

  describe "when password is passed" do
    it "returns the settings" do
      @options = { :brightbox_password => "password" }
      @config = Fog::Brightbox::Config.new(@options)
      assert_equal "password", @config.password
    end
  end

  describe "when account is passed" do
    it "returns the settings" do
      @options = { :brightbox_account => "acc-12345" }
      @config = Fog::Brightbox::Config.new(@options)
      assert_equal "acc-12345", @config.account
    end
  end

  describe "when account was passed but changed" do
    it "returns the new account" do
      @options = { :brightbox_account => "acc-12345" }
      @config = Fog::Brightbox::Config.new(@options)
      @config.change_account("acc-abcde")
      assert_equal "acc-abcde", @config.account
    end
  end

  describe "when account was passed, changed and reset" do
    it "returns the original account" do
      @options = { :brightbox_account => "acc-12345" }
      @config = Fog::Brightbox::Config.new(@options)
      @config.change_account("acc-abcde")
      @config.reset_account
      assert_equal "acc-12345", @config.account
    end
  end

  describe "when connection options are passed" do
    it "returns the settings" do
      @connection_settings = {
        :headers => {
          "Content-Type" => "application/json"
        }
      }
      @options = {
        :connection_options => @connection_settings
      }
      @config = Fog::Brightbox::Config.new(@options)
      assert_equal @connection_settings, @config.connection_options
    end
  end

  describe "when no connection options were passed" do
    it "returns an empty hash" do
      @config = Fog::Brightbox::Config.new
      assert_equal({}, @config.connection_options)
    end
  end

  describe "when persistent connection is requested" do
    it "returns true for the setting" do
      @options = { :persistent => true }
      @config = Fog::Brightbox::Config.new(@options)
      assert @config.connection_persistent?
    end
  end

  describe "when persistent connection is not specified" do
    it "returns false by default" do
      @config = Fog::Brightbox::Config.new
      refute @config.connection_persistent?
    end
  end

  describe "when cached OAuth tokens were passed" do
    before do
      @access_token = "1234567890abcdefghijklmnopqrstuvwxyz"
      @refresh_token = "1234567890abcdefghijklmnopqrstuvwxyz"
      @options = {
        :brightbox_access_token => @access_token,
        :brightbox_refresh_token => @refresh_token
      }
      @config = Fog::Brightbox::Config.new(@options)
    end

    it "returns the access token" do
      assert_equal @access_token, @config.cached_access_token
      assert_equal @access_token, @config.latest_access_token
    end

    it "returns the refresh token" do
      assert_equal @refresh_token, @config.cached_refresh_token
      assert_equal @refresh_token, @config.latest_refresh_token
    end

    it "does not need to authenticate" do
      refute @config.must_authenticate?
    end

    it "can expire the tokens" do
      @config.expire_tokens!
      assert_nil @config.latest_access_token
      assert_nil @config.latest_refresh_token
    end
  end

  describe "when token management is not specified" do
    it "returns true by default" do
      @config = Fog::Brightbox::Config.new
      assert @config.managed_tokens?
    end
  end

  describe "when token management setting is disabled" do
    it "returns false" do
      @options = { :brightbox_token_management => false }
      @config = Fog::Brightbox::Config.new(@options)
      refute @config.managed_tokens?
    end
  end

  describe "when a default server image is configured" do
    it "returns the configured setting" do
      @options = { :brightbox_default_image => "img-12345" }
      @config = Fog::Brightbox::Config.new(@options)
      assert_equal "img-12345", @config.default_image_id
    end
  end

  describe "when a default server is not set" do
    it "returns nil" do
      @config = Fog::Brightbox::Config.new
      assert_nil @config.default_image_id
    end
  end

  describe "when username and password are given" do
    it "user_credentials? returns true" do
      @options = {
        :brightbox_client_id => "app-12345",
        :brightbox_secret => "12345",
        :brightbox_username => "user@example.com",
        :brightbox_password => "12345"
      }
      @config = Fog::Brightbox::Config.new(@options)
      assert @config.user_credentials?
    end
  end

  describe "when no username is given" do
    it "user_credentials? returns false" do
      @options = {
        :brightbox_client_id => "cli-12345",
        :brightbox_secret => "12345"
      }
      @config = Fog::Brightbox::Config.new(@options)
      refute @config.user_credentials?
    end
  end

  describe "when setting management_url with URI" do
    it "sets it correctly" do
      uri = URI.parse("https://example.com")
      @config = Fog::Brightbox::Config.new
      @config.storage_management_url = uri
      assert_equal @config.storage_management_url, uri
    end
  end

  describe "when setting management_url with String" do
    it "raises ArgumentError" do
      uri = "http://example.com/wrong"
      assert_raises(ArgumentError) { Fog::Brightbox::Config.new.storage_management_url = uri }
    end
  end
end
