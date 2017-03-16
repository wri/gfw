require 'fog/core/collection'
require 'fog/aliyun/models/compute/vswitch'

module Fog
  module Compute
    class Aliyun
      class Vswitches < Fog::Collection
        attribute :vpc

        model Fog::Compute::Aliyun::Vswitch

        # Creates a new VPC
        #
        # Aliyun.vpcs.new
        #
        # ==== Returns
        #
        # Returns the details of the new VPC
        #
        #>> Aliyun.vpcs.new
        # <Fog::Aliyun::VPC::VPC
        # id=nil,
        # state=nil,
        # cidr_block=nil,
        # dhcp_options_id=nil
        # tags=nil
        # tenancy=nil
        # >
        
        # Returns an array of all VPCs that have been created
        #
        # Aliyun.vpcs.all
        #
        # ==== Returns
        #
        # Returns an array of all VPCs
        #
        #>> Aliyun.vpcs.all
        # <Fog::Aliyun::VPC::VPCs
        # filters={}
        # [
        # <Fog::Aliyun::VPC::VPC
        # id="vpc-12345678",
        # TODO
        # >
        # ]
        # >
        #

        def all(options={})
          requires :vpc
          data = Fog::JSON.decode(service.list_vswitchs(vpc.id, options).body)['VSwitches']['VSwitch']
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

        def get(vswitchId)
          requires :vpc
          if vswitchId
            self.class.new(:service => service,:vpc=>vpc).all(:vSwitchId=>vswitchId)[0]
          end
        end
      end
    end
  end
end
