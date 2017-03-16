module Fog
  module Storage
    class Aliyun
      class Real
        # Copy object
        #
        # ==== Parameters
        # * source_bucket<~String> - Name of source bucket
        # * source_object<~String> - Name of source object
        # * target_bucket<~String> - Name of bucket to create copy in
        # * target_object<~String> - Name for new copy of object
        # * options<~Hash> - Additional headers options={}
        def copy_object(source_bucket, source_object, target_bucket, target_object, options = {})
          options = options.reject {|key, value| value.nil?}
          bucket = options[:bucket]
          bucket ||= @aliyun_oss_bucket
          source_bucket ||= bucket
          target_bucket ||= bucket
          headers = { 'x-oss-copy-source' => "/#{source_bucket}/#{source_object}" }
          location = get_bucket_location(target_bucket)
          endpoint = "http://"+location+".aliyuncs.com"
          resource = target_bucket+'/'+target_object
          request({
            :expects  => [200, 203],
            :headers  => headers,
            :method   => 'PUT',
            :path     => target_object,
            :bucket   => target_bucket,
            :resource => resource,
            :endpoint => endpoint
          })
        end
      end
      
      class Mock
        def copy_object(source_bucket, source_object, target_bucket, target_object)
          
        end
      end
    end
  end
end
