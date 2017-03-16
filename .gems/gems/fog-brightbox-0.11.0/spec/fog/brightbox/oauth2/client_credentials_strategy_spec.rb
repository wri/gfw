require "spec_helper"

describe Fog::Brightbox::OAuth2::ClientCredentialsStrategy do
  before do
    @client_id = "app-12345"
    @client_secret = "__mashed_keys_123__"
    @credentials = Fog::Brightbox::OAuth2::CredentialSet.new(@client_id, @client_secret)
    @strategy = Fog::Brightbox::OAuth2::ClientCredentialsStrategy.new(@credentials)
  end

  it "tests #respond_to?(:authorization_body_data) returns true"  do
    assert @strategy.respond_to?(:authorization_body_data)
  end

  it "tests #respond_to?(:headers) returns true"  do
    assert @strategy.respond_to?(:headers)
  end

  it "tests #authorization_body_data" do
    authorization_body_data = @strategy.authorization_body_data
    assert_equal "client_credentials", authorization_body_data["grant_type"]
    refute_includes authorization_body_data, "client_id"
  end

  it "tests #headers" do
    headers = @strategy.headers
    assert_equal "Basic YXBwLTEyMzQ1Ol9fbWFzaGVkX2tleXNfMTIzX18=", headers["Authorization"]
    assert_equal "application/json", headers["Content-Type"]
  end
end
