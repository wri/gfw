module Fog
  module Compute
    class Voxel
      class Real
        def voxcloud_create(options)
          options[:parser] = Fog::Parsers::Compute::Voxel::VoxcloudCreate.new

          if options.key?(:password)
            options[:admin_password] = options[:password]
            options.delete(:password)
          end

          request("voxel.voxcloud.create", options)
        end
      end
    end
  end
end
