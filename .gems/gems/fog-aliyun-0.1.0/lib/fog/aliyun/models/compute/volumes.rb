require 'fog/core/collection'
require 'fog/aliyun/models/compute/volume'

module Fog
  module Compute
    class Aliyun
      class Volumes < Fog::Collection

        model Fog::Compute::Aliyun::Volume

        # Used to create a volume.  There are 3 arguments and availability_zone and size are required.  You can generate a new key_pair as follows:
        # Aliyun.volumes.create(:size => 10)
        #
        # ==== Returns
        #
        #<Fog::AWS::Compute::Volume
        #  id="vol-1e2028b9",
        #  attached_at=nil,
        #  availability_zone="us-east-1a",
        #  created_at=Tue Nov 23 23:30:29 -0500 2010,
        #  delete_on_termination=nil,
        #  device=nil,
        #  server_id=nil,
        #  size=10,
        #  snapshot_id=nil,
        #  state="creating",
        #  tags=nil
        #>
        #
        # The volume can be retrieved by running Aliyun.volumes.get("d-25ohde62o").  See get method below.
        #


        # Used to return all volumes.
        # Aliyun.volumes.all
        #
        # ==== Returns
        #
        #>>Aliyun.volumes.all
        # <Fog::Compute::Aliyun::Volumes
        #   [
        #                 <Fog::Compute::Aliyun::Volume
        #       id="d-25ohde62o",
        #       region_id="cn-beijing",
        #       zone_id="cn-beijing-a",
        #       name="",
        #       description="",
        #       type="data",
        #       category="cloud",
        #       size=10,
        #       image_id="",
        #       snapshot_id="",
        #       product_code="",
        #       portable=true,
        #       state="In_use",
        #       operation_locks={"OperationLock"=>[{"LockReason"=>"financial"}]},
        #       server_id="i-25l758pg4",
        #       device="/dev/xvdc",
        #       delete_with_instance=false,
        #       delete_auto_snapshot=true,
        #       enable_auto_snapshot=true,
        #       created_at="2015-08-03T11:35:10Z",
        #       attached_at="2015-08-03T11:35:15Z",
        #       detached_at="",
        #       expired_at="2015-09-29T15:45Z",
        #       charge_type="PostPaid",
        #       tags={"Tag"=>[]}
        #     >
        #   ]
        # >

        #
        # The volume can be retrieved by running Aliyun.volumes.get('d-25x03nah9').  See get method below.
        #

        def all(filters_arg = {})
          unless filters_arg.is_a?(Hash)
            Fog::Logger.deprecation("all with #{filters_arg.class} param is deprecated, use all('diskIds' => []) instead [light_black](#{caller.first})[/]")
            filters_arg = {'diskIds' => [*filters_arg]}
          end
          data = Fog::JSON.decode(service.list_disks(filters_arg).body)['Disks']['Disk']
          load(data)
          # load(data['volumeSet'])
          # if server
          #   self.replace(self.select {|volume| volume.server_id == server.id})
          # end
          # self
        end

        # Used to retrieve a volume
        # volume_id is required to get the associated volume information.
        #
        # You can run the following command to get the details:
        # Aliyun.volumes.get('d-25x03nah9')
        #
        # ==== Returns
        #
        #>> Aliyun.volumes.get('d-25ohde62o')
        #   <Fog::Compute::Aliyun::Volume
        #       id="d-25ohde62o",
        #       region_id="cn-beijing",
        #       zone_id="cn-beijing-a",
        #       name="",
        #       description="",
        #       type="data",
        #       category="cloud",
        #       size=10,
        #       image_id="",
        #       snapshot_id="",
        #       product_code="",
        #       portable=true,
        #       state="In_use",
        #       operation_locks={"OperationLock"=>[{"LockReason"=>"financial"}]},
        #       server_id="i-25l758pg4",
        #       device="/dev/xvdc",
        #       delete_with_instance=false,
        #       delete_auto_snapshot=true,
        #       enable_auto_snapshot=true,
        #       created_at="2015-08-03T11:35:10Z",
        #       attached_at="2015-08-03T11:35:15Z",
        #       detached_at="",
        #       expired_at="2015-09-29T15:45Z",
        #       charge_type="PostPaid",
        #       tags={"Tag"=>[]}
        #     >
        #

        def get(volume_id)
          if volume_id
            diskIds=Array.new(1,volume_id)
            self.class.new(:service => service).all(:diskIds => diskIds)[0]
          end
        end

      end
    end
  end
end

