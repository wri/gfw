require "spec_helper"

describe Fog::Brightbox::Storage::AuthenticationRequest do
  include StockStorageResponses

  describe "when initialised with blank config" do
    before do
      stub_request(:get, "https://orbit.brightbox.com/v1").
        with(:headers => {
               "Host" => "orbit.brightbox.com:443",
               "X-Auth-User" => "",
               "X-Auth-Key" => ""
             }).to_return(bad_url_response)
    end

    it "raises error" do
      settings = {}
      @config = Fog::Brightbox::Config.new(settings)
      @request = Fog::Brightbox::Storage::AuthenticationRequest.new(@config)
      assert_raises(Excon::Errors::PreconditionFailed) { @request.authenticate }
    end
  end

  describe "when initialised with API client details" do
    before do
      stub_request(:get, "https://orbit.brightbox.com/v1").
        with(:headers => {
               "Host" => "orbit.brightbox.com:443",
               "X-Auth-User" => "cli-12345",
               "X-Auth-Key" => "12345"
             }).to_return(authorized_response)
    end

    it "authenticates correctly" do
      settings = {
        :brightbox_client_id => "cli-12345",
        :brightbox_secret => "12345"
      }
      @config = Fog::Brightbox::Config.new(settings)
      @request = Fog::Brightbox::Storage::AuthenticationRequest.new(@config)
      assert @request.authenticate
    end
  end

  describe "when initialised with user details" do
    before do
      stub_request(:get, "https://orbit.brightbox.com/v1").
        with(:headers => {
               "Host" => "orbit.brightbox.com:443",
               "X-Auth-User" => "user@example.com",
               "X-Auth-Key" => "abcde"
             }).to_return(authorized_response)
    end

    it "authenticates correctly" do
      settings = {
        :brightbox_client_id => "app-12345",
        :brightbox_secret => "12345",
        :brightbox_username => "user@example.com",
        :brightbox_password => "abcde"
      }
      @config = Fog::Brightbox::Config.new(settings)
      @request = Fog::Brightbox::Storage::AuthenticationRequest.new(@config)
      assert @request.authenticate
    end
  end

  describe "when initialised with bad user details" do
    before do
      stub_request(:get, "https://orbit.brightbox.com/v1").
        with(:headers => {
               "Host" => "orbit.brightbox.com:443",
               "X-Auth-User" => "user@example.com",
               "X-Auth-Key" => "abcde"
             }).to_return(unauthorized_response)
    end

    it "raises error" do
      settings = {
        :brightbox_client_id => "app-12345",
        :brightbox_secret => "12345",
        :brightbox_username => "user@example.com",
        :brightbox_password => "abcde"
      }
      @config = Fog::Brightbox::Config.new(settings)
      @request = Fog::Brightbox::Storage::AuthenticationRequest.new(@config)
      assert_raises(Fog::Brightbox::Storage::AuthenticationRequired) { @request.authenticate }
    end
  end
end
