#
# Author:: Matt Eldridge (<plribeiro3000@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Softlayer
    module Slapi
      # Sends the real request to the real SoftLayer service.
      #
      # @param [String] service
      #   ...ayer.com/rest/v3/Softlayer_Service_Name...
      # @param path [String]
      #   ...ayer.com/rest/v3/Softlayer_Service_Name/path.json
      # @param [Hash] options
      # @option options [Array<Hash>] :body
      #   HTTP request body parameters
      # @option options [String] :softlayer_api_url
      #   Override the default (or configured) API endpoint
      # @option options [String] :softlayer_username
      #   Email or user identifier for user based authentication
      # @option options [String] :softlayer_api_key
      #   Password for user based authentication
      # @return [Excon::Response]
      def self.slapi_request(service, path, options)
        # default HTTP method to get if not passed
        http_method = options[:http_method] || :get
        # set the target base url
        @request_url = options[:softlayer_api_url] || Fog::Softlayer::SL_API_URL
        # tack on the username and password
        credentialize_url(options[:username], options[:api_key])
        # set the SoftLayer Service name
        set_sl_service(service)
        # set the request path (known as the "method" in SL docs)
        set_sl_path(path)
        # set the query params if any


        # build request params
        params = { :headers => user_agent_header }
        params[:headers]['Content-Type'] = 'application/json'
        params[:expects] = options[:expected] || [200,201]
        params[:query] = options[:query] unless options[:query].nil?
        unless options[:body].nil?
          options[:body] = [options[:body]] unless options[:body].kind_of?(Array)
          params[:body] = Fog::JSON.encode({:parameters => options[:body]})
        end

        # initialize connection object
        @connection = Fog::Core::Connection.new(@request_url, false, params)

        # send it
        response = @connection.request(:method => http_method)

        # decode it
        response.body = Fog::JSON.decode(response.body)
        response
      end

      private

      def self.credentialize_url(username, apikey)
        @request_url = "https://#{sanitize_username(username)}:#{apikey}@#{@request_url}"
      end

      def self.sanitize_username(username)
        un = username.dup
        un.gsub!(/@/, '%40')
        un
      end

      ##
      # Prepend "SoftLayer_" to the service name and Snake_Camel_Case the string before appending it to the @request_url.
      #
      def self.set_sl_service(service)
        service = "SoftLayer_" << service.to_s.gsub(/^softlayer_/i, '').split('_').map{|i|i.capitalize}.join('_')
        service.fix_convention_exceptions
        @request_url += "/#{service}"
      end

      ##
      # Try to smallCamelCase the path before appending it to the @request_url
      #
      def self.set_sl_path(path)
        path = path.to_s.softlayer_underscore.softlayer_camelize
        path.fix_convention_exceptions
        @request_url += "/#{path}.json"
      end

      def self.user_agent_header
        {"User-Agent" => "Fog SoftLayer Adapter #{Fog::Softlayer::VERSION}"}
      end
    end
  end
end
