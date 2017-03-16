module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/disk&detachdisk]
        def detach_disk(instanceId, diskId,options={})
          action   = 'DetachDisk'
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
