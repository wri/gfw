module Fog
  module Storage
    class Aliyun
      class Real
        # Create a new container
        #
        # ==== Parameters
        # * name<~String> - Name for container
        #
        def put_container(name, options={})
          bucket = options[:bucket]
          bucket ||= @aliyun_oss_bucket
          location = get_bucket_location(bucket)
          endpoint = "http://"+location+".aliyuncs.com"

          path = name+'/'
          resource = bucket+'/'+name+'/'
          request(
              :expects  => [200, 203],
              :method   => 'PUT',
              :path     => path,
              :bucket   => bucket,
              :resource => resource,
              :endpoint => endpoint
          )
        end
      end
      
      class Mock
        def put_container(name, options={})
        end
      end
    end
  end
end
