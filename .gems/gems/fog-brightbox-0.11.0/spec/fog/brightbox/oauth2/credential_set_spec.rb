require "spec_helper"

describe Fog::Brightbox::OAuth2::CredentialSet do
  before do
    @client_id     = "app-12345"
    @client_secret = "__mashed_keys_123__"
    @username      = "usr-12345"
    @password      = "__mushed_keys_321__"
    @access_token  = "12efde32fdfe4989"
    @refresh_token = "7894389f9074f071"
    @expires_in    = 7200
  end

  describe "when using client credentials" do
    before do
      @credentials = Fog::Brightbox::OAuth2::CredentialSet.new(@client_id, @client_secret)
    end

    it "tests #user_details? returns false" do
      refute @credentials.user_details?
    end

    it "tests #access_token? returns false" do
      refute @credentials.access_token?
    end

    it "tests #refresh_token? returns false" do
      refute @credentials.refresh_token?
    end

    it "tests #best_grant_strategy returns ClientCredentialStategy" do
      assert @credentials.best_grant_strategy.is_a?(Fog::Brightbox::OAuth2::ClientCredentialsStrategy)
    end
  end

  describe "when using user credentials" do
    before do
      options = { :username => @username, :password => @password }
      @credentials = Fog::Brightbox::OAuth2::CredentialSet.new(@client_id, @client_secret, options)
    end

    it "tests #user_details? returns true" do
      assert @credentials.user_details?
    end

    it "tests #access_token? returns false" do
      refute @credentials.access_token?
    end

    it "tests #refresh_token? returns false" do
      refute @credentials.refresh_token?
    end

    it "tests #best_grant_strategy returns ClientCredentialStategy" do
      assert @credentials.best_grant_strategy.is_a?(Fog::Brightbox::OAuth2::UserCredentialsStrategy)
    end
  end

  describe "when using refresh token" do
    before do
      options = {
        :username => @username,
        :access_token => @access_token,
        :refresh_token => @refresh_token,
        :expires_in => @expires_in
      }
      @credentials = Fog::Brightbox::OAuth2::CredentialSet.new(@client_id, @client_secret, options)
    end

    it "tests #user_details? returns false" do
      refute @credentials.user_details?
    end

    it "tests #access_token? returns true" do
      assert @credentials.access_token?
    end

    it "tests #refresh_token? returns true" do
      assert @credentials.refresh_token?
    end

    it "tests #best_grant_strategy returns ClientCredentialStategy" do
      assert @credentials.best_grant_strategy.is_a?(Fog::Brightbox::OAuth2::RefreshTokenStrategy)
    end
  end
end
