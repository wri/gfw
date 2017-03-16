module Fog
  module Storage
    class Aliyun
      class Real
        # List existing storage containers
        #
        # ==== Parameters
        # * options<~Hash>:
        #   * 'maxKeys'<~Integer> - Upper limit to number of results returned
        #   * 'marker'<~String> - Only return objects with name greater than this value
        #
        # ==== Returns
        #
        def get_containers(options = {})
          options = options.reject {|key, value| value.nil?}
          bucket = options[:bucket]
          bucket ||= @aliyun_oss_bucket
          prefix = options[:prefix]
          marker = options[:marker]
          maxKeys = options[:maxKeys]
          delimiter = '/'

          path = ""
          if prefix
            path+="?prefix="+prefix
            if marker
              path+="&marker="+marker
            end
            if maxKeys
              path+="&max-keys="+maxKeys
            end
            if delimiter
              path+="&delimiter="+delimiter
            end

          elsif marker
            path+="?marker="+marker
            if maxKeys
              path+="&max-keys="+maxKeys
            end
            if delimiter
              path+="&delimiter="+delimiter
            end

          elsif maxKeys
            path+="?max-keys="+maxKeys
            if delimiter
              path+="&delimiter="+delimiter
            end

          elsif delimiter
            path+="?delimiter="+delimiter
          end

          location = get_bucket_location(bucket)
          endpoint = "http://"+location+".aliyuncs.com"
          resource = bucket+'/'
          ret = request(
              :expects  => [200, 203, 400],
              :method   => 'GET',
              :path     => path,
              :resource => resource,
              :bucket => bucket
          )
          xml = ret.data[:body]
          result = XmlSimple.xml_in(xml)["CommonPrefixes"]
        end
      end

      class Mock
        def get_containers(options = {})
        end
      end
    end
  end
end
