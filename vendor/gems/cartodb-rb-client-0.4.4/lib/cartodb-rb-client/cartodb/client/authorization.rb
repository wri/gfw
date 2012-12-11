require 'oauth/request_proxy/typhoeus_request'

module CartoDB
  module Client
    module Authorization

      CRLF = "\r\n"

      def signed_request(request_uri, arguments)
        arguments[:disable_ssl_peer_verification] = true

        if CartoDB::Settings['api_key'].present?
          arguments[:params][:api_key] = CartoDB::Settings['api_key']
        end

        request = Typhoeus::Request.new(request_uri, arguments)

        request = as_multipart(request, arguments[:params]) if arguments[:multipart] == true

        unless arguments[:params][:api_key].present?
          request.headers.merge!({"Authorization" => oauth_helper(request, request_uri).header})
        end

        request
      end
      private :signed_request

      def access_token
        return @access_token if @access_token

        @access_token ||= if CartoDB::Settings['oauth_access_token'] && CartoDB::Settings['oauth_access_token_secret']
          OAuth::AccessToken.new(oauth_consumer, CartoDB::Settings['oauth_access_token'], CartoDB::Settings['oauth_access_token_secret'])
        elsif CartoDB::Settings['username'] && CartoDB::Settings['password']

          x_auth_params = {
            :x_auth_mode => :client_auth,
            :x_auth_username => CartoDB::Settings['username'],
            :x_auth_password => CartoDB::Settings['password']
          }
          response = oauth_consumer.request(:post, oauth_consumer.access_token_url,  nil, {}, x_auth_params)

          values = response.body.split('&').inject({}) { |h,v| h[v.split("=")[0]] = v.split("=")[1]; h }

          OAuth::AccessToken.new(oauth_consumer, values["oauth_token"], values["oauth_token_secret"])
        else
          nil
        end
      end
      private :access_token

      def oauth_params
        {:consumer => oauth_consumer, :token => access_token}
      end
      private :oauth_params

      def oauth_consumer
        @oauth_consumer ||= OAuth::Consumer.new(CartoDB::Settings['oauth_key'], CartoDB::Settings['oauth_secret'], :site => CartoDB::Settings['host'])
      end
      private :oauth_consumer

      def oauth_helper(request, request_uri)
        OAuth::Client::Helper.new(request, oauth_params.merge(:request_uri => request_uri))
      end
      private :oauth_helper

      def as_multipart(request, params)

        boundary = Time.now.to_i.to_s(16)
        request.headers["Content-Type"] = "multipart/form-data; boundary=#{boundary}"
        body = ""
        params.each do |key,value|
          esc_key = CGI.escape(key.to_s)
          body << "--#{boundary}#{CRLF}"
          if value.respond_to?(:read)
            body << "Content-Disposition: form-data; name=\"#{esc_key}\"; filename=\"#{File.basename(value.path)}\"#{CRLF}"
            body << "Content-Type: application/octet-stream#{CRLF*2}"
            body << value.read.force_encoding('utf-8')
          else
            body << "Content-Disposition: form-data; name=\"#{esc_key}\"#{CRLF*2}#{value}"
          end
          body << CRLF
        end
        body << "--#{boundary}--#{CRLF*2}"
        request.body = body
        request.params = {}
        request
      end
      private :as_multipart

    end
  end
end
