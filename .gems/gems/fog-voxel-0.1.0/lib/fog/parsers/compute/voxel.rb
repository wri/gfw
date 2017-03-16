module Fog
  module Parsers
    module Compute
      module Voxel
        autoload :Basic, "fog/parsers/compute/voxel/basic"
        autoload :DevicesList, "fog/parsers/compute/voxel/devices_list"
        autoload :ImagesList, "fog/parsers/compute/voxel/images_list"
        autoload :VoxcloudCreate, "fog/parsers/compute/voxel/voxcloud_create"
        autoload :VoxcloudDelete, "fog/parsers/compute/voxel/voxcloud_delete"
        autoload :Voxcloudstatus, "fog/parsers/compute/voxel/voxcloud_status"
      end
    end
  end
end
