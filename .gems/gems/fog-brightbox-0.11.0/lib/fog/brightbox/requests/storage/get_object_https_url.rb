module Fog
  module Storage
    class Brightbox
      class Real
        # Get an expiring object https url from Cloud Files
        #
        # ==== Parameters
        # * container<~String> - Name of container containing object
        # * object<~String> - Name of object to get expiring url for
        # * expires<~Time> - An expiry time for this url
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~String> - url for object
        def get_object_https_url(container, object, expires, options = {})
          create_temp_url(container, object, expires, "GET", options.merge(:scheme => "https"))
        end

        # creates a temporary url
        #
        # @param container [String] Name of container containing object
        # @param object [String] Name of object to get expiring url for
        # @param expires_at [Time] An expiry time for this url
        # @param method [String] The method to use for accessing the object (GET, PUT, HEAD)
        # @param options [Hash] An optional options hash
        # @option options [String] :scheme The scheme to use (http, https)
        # @option options [String] :port A non standard port to use
        #
        # @return [String] url for object
        #
        # @raise [ArgumentError] if +storage_temp_key+ is not set in configuration
        # @raise [ArgumentError] if +method+ is not valid
        #
        # @see http://docs.rackspace.com/files/api/v1/cf-devguide/content/Create_TempURL-d1a444.html
        #
        def create_temp_url(container, object, expires_at, method, options = {})
          raise ArgumentError, "Storage must be instantiated with the :brightbox_temp_url_key option" if @config.storage_temp_key.nil?

          # POST not allowed
          allowed_methods = %w(GET PUT HEAD)
          unless allowed_methods.include?(method)
            raise ArgumentError.new("Invalid method '#{method}' specified. Valid methods are: #{allowed_methods.join(", ")}")
          end

          # This assumes we have access to the management URL at this point
          destination_url = management_url.dup
          object_path = destination_url.path

          destination_url.scheme = options[:scheme] if options[:scheme]
          destination_url.port = options[:port] if options[:port]

          object_path_escaped = "#{object_path}/#{Fog::Storage::Brightbox.escape(container)}/#{Fog::Storage::Brightbox.escape(object, "/")}"
          object_path_unescaped = "#{object_path}/#{Fog::Storage::Brightbox.escape(container)}/#{object}"

          expiry_timestamp = expires_at.to_i
          string_to_sign = [method, expiry_timestamp, object_path_unescaped].join("\n")

          hmac = Fog::HMAC.new("sha1", @config.storage_temp_key)
          sig = sig_to_hex(hmac.sign(string_to_sign))

          destination_url.path = object_path_escaped
          destination_url.query = URI.encode_www_form(:temp_url_sig => sig, :temp_url_expires => expiry_timestamp)
          destination_url.to_s
        end

        private

        def sig_to_hex(str)
          str.unpack("C*").map { |c|
            c.to_s(16)
          }.map { |h|
            h.size == 1 ? "0#{h}" : h
          }.join
        end
      end
    end
  end
end
