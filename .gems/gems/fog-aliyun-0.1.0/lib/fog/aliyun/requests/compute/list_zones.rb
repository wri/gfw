module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/region&describezones]
        def list_zones()
          action = 'DescribeZones'
          sigNonce = randonStr()
          time = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)

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
        def list_zones(*args)
          Excon::Response.new(
            :body   => { "availabilityZoneInfo" => [
                  {
                      "zoneState" => {
                          "available" => true
                      },
                      "hosts" => nil,
                      "zoneName" => "nova"
                  }
              ] },
            :status => 200
          )
        end
      end
    end
  end
end
