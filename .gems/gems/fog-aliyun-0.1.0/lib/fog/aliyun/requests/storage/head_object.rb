module Fog
  module Storage
    class Aliyun
      class Real
        # Get headers for object
        #
        # ==== Parameters
        # * object<~String> - Name of object to look for
        #
        def head_object(object, options={})
          bucket = options[:bucket]
          bucket ||= @aliyun_oss_bucket
          location = get_bucket_location(bucket)
          endpoint = "http://"+location+".aliyuncs.com"
          resource = bucket+'/'+object
          ret = request(
            :expects  => [200, 404],
            :method   => 'HEAD',
            :path     => object,
            :bucket   => bucket,
            :resource => resource,
            :endpoint => endpoint
          )
          return ret
        end
      end

      class Mock
        def head_object(object, options={})
        end
      end
    end
  end
end
