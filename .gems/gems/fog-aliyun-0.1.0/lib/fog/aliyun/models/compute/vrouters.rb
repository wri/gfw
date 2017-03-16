require 'fog/core/collection'
require 'fog/aliyun/models/compute/vrouter'

module Fog
  module Compute
    class Aliyun
      class Vrouters < Fog::Collection

        model Fog::Compute::Aliyun::VRouter

        # Returns an array of all VPCs that have been created
        #
        # Aliyun.vrouters.all
        #
        # ==== Returns
        #
        # Returns an array of all VPCs
        #
        #>> Aliyun.vrouters.all
        # <Fog::Aliyun::Compute::VRouters
        # [
        # <Fog::Aliyun::Compute::VRouter
        # id="vpc-12345678",
        # TODO
        # >
        # ]
        # >
        #

        def all(filters_arg = {})
          unless filters_arg.is_a?(Hash)
            Fog::Logger.warning("all with #{filters_arg.class} param is deprecated, use all('vRouterId' => "") instead [light_black](#{caller.first})[/]")
            filters_arg = {'vRouterId' => filters_arg}
          end
          data = Fog::JSON.decode(service.list_vrouters(filters_arg).body)['VRouters']['VRouter']
          load(data)
        end

        # Used to retrieve a VPC
        # vpc_id is required to get the associated VPC information.
        #
        # You can run the following command to get the details:
        # Aliyun.vpcs.get("vpc-12345678")
        #
        # ==== Returns
        #
        #>> Aliyun.vpcs.get("vpc-12345678")
        # <Fog::Aliyun::Compute::VPC
        # id="vpc-12345678",
        # TODO
        # >
        #

        def get(vRouterId)
          if vRouterId
            self.class.new(:service => service).all('vRouterId' => vRouterId)[0]
          end
        end
      end
    end
  end
end
