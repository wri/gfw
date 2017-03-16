module Fog
  module Storage
    class Aliyun
      class Real
        # Delete an existing container
        #
        # ==== Parameters
        # * container<~String> - Name of container to delete
        # * options
        #
        def delete_container(container, options={})

          bucket = options[:bucket]
          bucket ||= @aliyun_oss_bucket
          location = get_bucket_location(bucket)
          endpoint = "http://"+location+".aliyuncs.com"
          object = container+'/'
          resource = bucket+'/'+object

          request(
              :expects  => 204,
              :method   => 'DELETE',
              :path     => object,
              :bucket   => bucket,
              :resource => resource,
              :endpoint => endpoint
          )
        end
      end
      class Mock
        
        def delete_container(container, options={})

        end
      end
    end
  end
end
