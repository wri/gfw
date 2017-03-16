module Fog
  module Radosgw
    module Utils
      def configure_uri_options(options = {})
        @host       = options[:host]       || 'localhost'
        @persistent = options[:persistent] || true
        @port       = options[:port]       || 8080
        @scheme     = options[:scheme]     || 'http'
      end

      def radosgw_uri
        "#{@scheme}://#{@host}:#{@port}"
      end

      def escape(string)
        string.gsub(/([^a-zA-Z0-9_.\-~]+)/) {
          "%" + $1.unpack("H2" * $1.bytesize).join("%").upcase
        }
      end

      def signature(params, expires)
        headers = params[:headers] || {}

        string_to_sign = [
          params[:method].to_s.upcase,
          headers['Content-MD5'],
          headers['Content-Type'],
          expires].map(&:to_s).join("\n") + "\n"

        amz_headers, canonical_amz_headers = {}, ''
        for key, value in headers
          if key[0..5] == 'x-amz-'
            amz_headers[key] = value
          end
        end
        amz_headers = amz_headers.sort {|x, y| x[0] <=> y[0]}
        for key, value in amz_headers
          canonical_amz_headers << "#{key}:#{value}\n"
        end
        string_to_sign << canonical_amz_headers


        query_string = ''
        if params[:query]
          query_args = []
          for key in params[:query].keys.sort
            if VALID_QUERY_KEYS.include?(key)
              value = params[:query][key]
              if value
                query_args << "#{key}=#{value}"
              else
                query_args << key
              end
            end
          end
          if query_args.any?
            query_string = '?' + query_args.join('&')
          end
        end

        canonical_path = (params[:path] || object_to_path(params[:object_name])).to_s
        canonical_path = '/' + canonical_path if canonical_path[0..0] != '/'
        if params[:bucket_name]
          canonical_resource = "/#{params[:bucket_name]}#{canonical_path}"
        else
          canonical_resource = canonical_path
        end
        canonical_resource << query_string
        string_to_sign << canonical_resource

        hmac = Fog::HMAC.new('sha1', @radosgw_secret_access_key)
        signed_string = hmac.sign(string_to_sign)
        Base64.encode64(signed_string).chomp!
      end

      def signed_headers(params)
        expires = Fog::Time.now.to_date_header
        auth   =  signature(params,expires)
        awskey =  @radosgw_access_key_id
        headers = {
            'Date'          => expires,
            'Authorization' => "AWS #{awskey}:#{auth}"
        }
      end
    end
  end
end
