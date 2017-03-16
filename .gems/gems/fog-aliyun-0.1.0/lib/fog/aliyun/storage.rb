require 'xmlsimple'

module Fog
  module Storage
    class Aliyun < Fog::Service
      recognizes :aliyun_oss_endpoint, 
                 :aliyun_oss_location,
                 :aliyun_oss_bucket,
                 :aliyun_accesskey_id, 
                 :aliyun_accesskey_secret

      model_path 'fog/aliyun/models/storage'
      model       :directory
      collection  :directories
      model       :file
      collection  :files

      request_path 'fog/aliyun/requests/storage'
      request :copy_object
      request :delete_bucket
      request :delete_object
      request :get_bucket
      request :get_object
      request :get_object_http_url
      request :get_object_https_url
      request :head_object
      request :put_bucket
      request :put_object
      request :list_buckets
      request :list_objects
      request :get_containers
      request :get_container
      request :delete_container
      request :put_container

      class Real
        # Initialize connection to OSS
        #
        # ==== Notes
        # options parameter must include values for :aliyun_oss_endpoint, :aliyun_accesskey_id,
        # :aliyun_secret_access_key, :aliyun_oss_location and :aliyun_oss_bucket in order to create a connection.
        # if you haven't set these values in the configuration file.
        #
        # ==== Examples
        #   sdb = Fog::Storage.new(:provider=>'aliyun',
        #    :aliyun_accesskey_id => your_:aliyun_accesskey_id,
        #    :aliyun_secret_access_key => your_aliyun_secret_access_key
        #   )
        #
        # ==== Parameters
        # * options<~Hash> - config arguments for connection.  Defaults to {}.
        #
        # ==== Returns
        # * OSS object with connection to aliyun.
        attr_reader :aliyun_accesskey_id
        attr_reader :aliyun_accesskey_secret
        attr_reader :aliyun_oss_endpoint
        attr_reader :aliyun_oss_location
        attr_reader :aliyun_oss_bucket

        def initialize(options={})
          #initialize the parameters
          @aliyun_oss_endpoint     = options[:aliyun_oss_endpoint]
          @aliyun_oss_location     = options[:aliyun_oss_location]
          @aliyun_accesskey_id     = options[:aliyun_accesskey_id]
          @aliyun_accesskey_secret = options[:aliyun_accesskey_secret]
          @aliyun_oss_bucket       = options[:aliyun_oss_bucket]

          #check for the parameters
          missing_credentials = Array.new
          missing_credentials << :aliyun_oss_endpoint unless @aliyun_oss_endpoint
          missing_credentials << :aliyun_oss_location unless @aliyun_oss_location
          missing_credentials << :aliyun_accesskey_id  unless @aliyun_accesskey_id
          missing_credentials << :aliyun_accesskey_secret unless @aliyun_accesskey_secret
          raise ArgumentError, "Missing required arguments: #{missing_credentials.join(', ')}" unless missing_credentials.empty?

          @connection_options = options[:connection_options] || {}
          
          uri = URI.parse(@aliyun_oss_endpoint)
          @host   = uri.host
          @path   = uri.path
          @port   = uri.port
          @scheme = uri.scheme

          @persistent = options[:persistent] || false

        end

        def reload
          @connection.reset
        end

        def request(params)
          method = params[:method]
          time = Time.new.utc
          date = time.strftime("%a, %d %b %Y %H:%M:%S GMT")

          endpoint = params[:endpoint]
          if endpoint
            uri = URI.parse(endpoint)
            host   = uri.host
            path   = uri.path
            port   = uri.port
            scheme = uri.scheme
          else
            host   = @host
            path   = @path
            port   = @port
            scheme = @scheme
          end

          bucket = params[:bucket]
          if bucket
            tmpHost = bucket + '.' + host
          else
            tmpHost = host
          end

          @connection = Fog::Core::Connection.new("#{scheme}://#{tmpHost}", @persistent, @connection_options)
          contentType = params[:contentType]

          begin
            headers = ""
            if params[:headers]
              params[:headers].each do |k,v| 
                if k != "Range"
                  headers += "#{k}:#{v}\n"
                end
              end
            end
            signature = sign(method, date, contentType, params[:resource], headers)
            response = @connection.request(params.merge({
              :headers  => {
                'Content-Type' => contentType,
                'Authorization' =>'OSS '+@aliyun_accesskey_id+':'+signature,
                'Date' => date
              }.merge!(params[:headers] || {}),
              :path     => "#{path}/#{params[:path]}",
              :query    => params[:query]
            }))
          rescue Excon::Errors::HTTPStatusError => error
            raise case error
              when Excon::Errors::NotFound
                Fog::Storage::Aliyun::NotFound.slurp(error)
              else
                error
              end
          end

          response
        end

        #copmute signature
        def sign (method, date, contentType, resource=nil, headers = nil)
          contentmd5 = ""

          if resource
            canonicalizedResource = "/"+resource
          else
            canonicalizedResource = "/"
          end

          if headers
            canonicalizedOSSHeaders = headers
          else
            canonicalizedOSSHeaders = ""
          end
          
          if contentType
            contentTypeStr = contentType
          else
            contentTypeStr = ""
          end

          stringToSign = method+"\n"+contentmd5+"\n"+contentTypeStr+"\n"+date+"\n"+canonicalizedOSSHeaders+canonicalizedResource

          digVer =  OpenSSL::Digest.new("sha1")
          digest =  OpenSSL::HMAC.digest(digVer, @aliyun_accesskey_secret, stringToSign)
          signature = Base64.encode64(digest)
          signature[-1] = ""

          return signature
        end
      end

      class Mock
        def initialize(options={})
          @aliyun_oss_endpoint     = options[:aliyun_oss_endpoint]
          @aliyun_oss_location     = options[:aliyun_oss_location]
          @aliyun_accesskey_id     = options[:aliyun_accesskey_id]
          @aliyun_accesskey_secret = options[:aliyun_accesskey_secret]
          @aliyun_oss_bucket       = options[:aliyun_oss_bucket]

          #missing_credentials = Array.new
          #missing_credentials << :aliyun_oss_endpoint unless @aliyun_oss_endpoint
          #missing_credentials << :aliyun_oss_location unless @aliyun_oss_location
          #missing_credentials << :aliyun_accesskey_id  unless @aliyun_accesskey_id
          #missing_credentials << :aliyun_accesskey_secret unless @aliyun_accesskey_secret
          #raise ArgumentError, "Missing required arguments: #{missing_credentials.join(', ')}" unless missing_credentials.empty?

          @connection_options = options[:connection_options] || {}
          
          #uri = URI.parse(@aliyun_oss_endpoint)
          #@host   = uri.host
          #@path   = uri.path
          #@port   = uri.port
          #@scheme = uri.scheme

          #@persistent = options[:persistent] || false
        end
      end
    end
  end
end
