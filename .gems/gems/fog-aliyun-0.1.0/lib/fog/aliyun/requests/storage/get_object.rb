module Fog
  module Storage
    class Aliyun
      class Real
        # Get details for object
        #
        # ==== Parameters
        # * object<~String> - Name of object to look for
        #
        def get_object(object, range = nil, options = {})
          options = options.reject {|key, value| value.nil?}
          bucket = options[:bucket]
          bucket ||= @aliyun_oss_bucket
          endpoint = options[:endpoint]
          if (nil == endpoint)
            location = get_bucket_location(bucket)
            endpoint = "http://"+location+".aliyuncs.com"
          end
          resource = bucket+'/'+object
          para = {
            :expects  => [200, 206, 404],
            :method   => 'GET',
            :path     => object,
            :bucket   => bucket,
            :resource => resource,
            :endpoint => endpoint
          }

          if range
            rangeStr = "bytes="+range
            para[:headers] = {'Range' => rangeStr}
          end

          response = request(para)
          response.data
        end
      end

      class Mock
        def get_object(object, range = nil, options = {})
        end
      end
    end
  end
end
