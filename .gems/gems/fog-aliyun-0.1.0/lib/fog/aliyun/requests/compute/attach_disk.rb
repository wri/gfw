module Fog
  module Compute
    class Aliyun
      class Real
        # Mount a disk.
        #
        # ==== Parameters
        # * instanceId<~String> - id of the instance
        # * diskId<~String> - id of the disk
        # * options<~hash>
        #     * :deleteWithInstance - if 'true',the disk will be relese with the instance.else, won't
        #     * :device - if nil, the system will default allocate from /dev/xvdb to /dev/xvdz. default nil
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * 'RequestId'<~String> - Id of the request
        #
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.201.106.DGkmH7#/pub/ecs/open-api/disk&attachdisk]
        def attach_disk(instanceId, diskId, options={})
          action   = 'AttachDisk'
          sigNonce = randonStr()
          time     = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)
          
          parameters["InstanceId"] = instanceId
          pathUrl += '&InstanceId='
          pathUrl += instanceId	

          parameters["DiskId"] = diskId
          pathUrl += '&DiskId='
          pathUrl += diskId
          
          deleteWithInstance = options[:deleteWithInstance]
          device             = options[:device]
          
          unless deleteWithInstance
            deleteWithInstance = 'true' 
          end

          parameters["DeleteWithInstance"] = deleteWithInstance
          pathUrl += '&DeleteWithInstance='
          pathUrl += deleteWithInstance


          if device
            parameters["Device"] = device
            pathUrl += '&Device='
            pathUrl += URI.encode(device,'/[^!*\'()\;?:@#&%=+$,{}[]<>`" ')
          end

          signature = sign(@aliyun_accesskey_secret, parameters)
          pathUrl += '&Signature='
          pathUrl += signature

          request(
            :expects  => [200, 203],
            :method   => 'GET',
            :path     => pathUrl
          )
        end
      end

      class Mock
        def attach_volume(volume_id, server_id, device)
          response = Excon::Response.new
          response.status = 200
          data = {
             'id'       => volume_id,
             'volumeId' => volume_id,
             'serverId' => server_id,
             'device'   => device
          }
          self.data[:volumes][volume_id]['attachments'] << data
          response.body = { 'volumeAttachment' => data }
          response
        end
      end
    end
  end
end
