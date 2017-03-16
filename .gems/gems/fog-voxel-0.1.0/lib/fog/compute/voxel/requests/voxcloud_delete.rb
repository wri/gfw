module Fog
  module Compute
    class Voxel
      class Real
        def voxcloud_delete(device_id)
          options = {
            :device_id  => device_id,
            :parser     => Fog::Parsers::Compute::Voxel::VoxcloudDelete.new
          }

          request("voxel.voxcloud.delete", options)
        end
      end
    end
  end
end
