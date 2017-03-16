module Fog
  module Brightbox
    # The {Fog::Brightbox::Config} class is designed to encapsulate a group of settings for reuse
    # between Brightbox services. The same config can be used for any service.
    #
    # The config also holds the latest set of access tokens which when shared means when one service
    # is told a token has expired then another will not retry it.
    #
    class Config
      # Creates a new set of configuration settings based on the options provided.
      #
      # @param [Hash] options The configuration settings
      # @option options [String] :brightbox_access_token
      #   Set to use a cached OAuth access token to avoid having to request new access rights.
      # @option options [String] :brightbox_account
      #   Set to specify the account to scope requests to if relevant. API clients are limited to
      #   their owning accounts but users can access any account they collaborate on.
      # @option options [String] :brightbox_api_url (https://api.gb1.brightbox.com)
      #   Set an alternative API endpoint to send requests to.
      # @option options [String] :brightbox_auth_url (https://api.gb1.brightbox.com)
      #   Set an alternative OAuth authentication endpoint to send requests to.
      # @option options [String] :brightbox_client_id
      #   Set to specify the client identifier to use for requests. Either +cli-12345+ or
      #   +app-12345+ are suitable settings.
      # @option options [String] :brightbox_default_image
      #   Set to specify a preferred image to use by default in the Compute service.
      # @option options [String] :brightbox_password
      #   Set to specify your user's password to authenticate yourself. This is independent of the
      #   client used to access the API.
      # @option options [String] :brightbox_refresh_token
      #   Set to use a cached OAuth refresh token to avoid having to request new access rights.
      # @option options [String] :brightbox_secret
      #   Set to specify the client secret to use for requests.
      # @option options [String] :brightbox_token_management (true)
      #   Set to specify if the service should handle expired tokens or raise an error instead.
      # @option options [String] :brightbox_username
      #   Set to specify your user account. Either user identifier (+usr-12345+) or email address
      #   may be used.
      # @option options [String] :connection_options ({})
      #   Set to pass options through to the HTTP connection.
      # @option options [Boolean] :persistent (false)
      #   Set to specify if the HTTP connection be persistent
      #
      # @example Use Fog.credentials
      #   # Assuming credentials are setup to return Brightbox settings and not other providers!
      #   @config = Fog::Brightbox::Config.new(Fog.credentials)
      #
      def initialize(options = {})
        @options = options
      end

      # @return [OAuth2::CredentialSet]
      def credentials
        @credentials ||= OAuth2::CredentialSet.new(client_id, client_secret,
                                                   :username => username,
                                                   :password => password,
                                                   :access_token => cached_access_token,
                                                   :refresh_token => cached_refresh_token
                                                  )
      end

      # @return [Boolean]
      def user_credentials?
        credentials.user_details?
      end

      # Can this be used to configure services? Yes, yes it can.
      #
      # @return [true]
      def config_service?
        true
      end

      def to_hash
        @options
      end

      # @return [URI::HTTPS] A URI object for the authentication endpoint
      def auth_url
        URI.parse(@options.fetch(:brightbox_auth_url, "https://api.gb1.brightbox.com"))
      end

      # @return [URI::HTTPS] A URI object for the main API/compute service endpoint
      def compute_url
        URI.parse(@options.fetch(:brightbox_api_url, "https://api.gb1.brightbox.com"))
      end
      alias_method :api_url, :compute_url

      def storage_url
        URI.parse(@options[:brightbox_storage_url] || "https://orbit.brightbox.com")
      end

      # The {#storage_management_url} is based on the {#storage_url} and the account details used when
      # autheticating. This is normally automatically discovered within the servive but can be
      # overridden in the {Config}
      #
      # @return [URI] if the URL is configured
      # @return [nil] if the URL is not configured
      def storage_management_url
        @storage_management_url ||= if @options.key?(:brightbox_storage_management_url)
                                      URI.parse(@options[:brightbox_storage_management_url])
                                    else
                                      nil
                                    end
      end

      # @param [URI] management_url The +URI+ to use for management requests.
      # @raise [ArgumentError] if non +URI+ object passed
      def storage_management_url=(management_url)
        raise ArgumentError unless management_url.kind_of?(URI)
        @storage_management_url = management_url
      end

      # @return [String] The configured identifier of the API client or user application.
      def client_id
        @options[:brightbox_client_id]
      end

      # @return [String] The configured secret to use to identify the client.
      def client_secret
        @options[:brightbox_secret]
      end

      # @return [String] The configured email or user identified to use when accessing the API.
      def username
        @options[:brightbox_username]
      end

      # @return [String] The configured password to use to identify the user.
      def password
        @options[:brightbox_password]
      end

      # @return [String] The configured account identifier to scope API requests by.
      def account
        @current_account ||= @options[:brightbox_account]
      end

      # This changes the scoped account from the originally configured one to another.
      #
      # @return [String] The new account identifier used to scope API requests by.
      def change_account(new_account)
        @current_account = new_account
      end

      # Sets the scoped account back to originally configured one.
      #
      # @return [String] The configured account identifier to scope API requests by.
      def reset_account
        @current_account = @options[:brightbox_account]
      end

      def connection_options
        # These are pretty much passed through to the requests as is.
        @options.fetch(:connection_options, {})
      end

      def connection_persistent?
        @options.fetch(:persistent, false)
      end

      def cached_access_token
        @options[:brightbox_access_token]
      end

      def latest_access_token
        credentials.access_token
      end

      def cached_refresh_token
        @options[:brightbox_refresh_token]
      end

      # This is the current, most up to date refresh token.
      def latest_refresh_token
        credentials.refresh_token
      end

      def must_authenticate?
        !credentials.access_token?
      end

      # Allows classes sharing to mark the tokens as invalid in response to API status codes.
      def expire_tokens!
        update_tokens(nil)
      end

      # @param [String] access_token The new access token to use
      # @param [String] refresh_token The new refresh token to use
      def update_tokens(access_token, refresh_token = nil, expires_in = nil)
        credentials.update_tokens(access_token, refresh_token, expires_in)
      end

      def managed_tokens?
        @options.fetch(:brightbox_token_management, true)
      end

      def default_image_id
        @options.fetch(:brightbox_default_image, nil)
      end

      def latest_token
        @options[:brightbox_access_token]
      end

      def service_type
        @options[:brightbox_service_type] || "object-store"
      end

      def service_name
        @options[:brightbox_service_name]
      end

      def region
        @options[:brightbox_region]
      end

      def tenant
        @options[:brightbox_tenant]
      end

      def storage_connection_options
        @options[:connection_options] || {}
      end

      def storage_temp_key
        @options[:brightbox_temp_url_key]
      end
    end
  end
end
