require 'fog/core/collection'
require 'fog/aliyun/models/compute/image'

module Fog
  module Compute
    class Aliyun
      class Images < Fog::Collection

        model Fog::Compute::Aliyun::Image


        def all(filters_arg = {})
          unless filters_arg.is_a?(Hash)
            Fog::Logger.deprecation("all with #{filters_arg.class} param is deprecated, use all('diskIds' => []) instead [light_black](#{caller.first})[/]")
            filters_arg = {:imageId => filters_arg}
          end
          data = Fog::JSON.decode(service.list_images(filters_arg).body)['Images']['Image']
          load(data)
        end

        def get(image_id)
          if image_id
            self.class.new(:service => service).all(:imageId => image_id)[0]
          end
        end
      end
    end
  end
end
