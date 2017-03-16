require 'fog/compute/models/server'

module Fog
  module Compute
    class Aliyun
      class Server < Fog::Compute::Server
        identity :id,                 :aliases=>'InstanceId'
        attribute :image_id,          :aliases => 'ImageId'
        attribute :inner_ip,          :aliases => 'InnerIpAddress'
        attribute :vlan_id,           :aliases => 'VlanId'
        attribute :eip,               :aliases => 'EipAddress'
        attribute :max_bandwidth_in,  :aliases => 'InternetMaxBandwidthIn'
        attribute :zone_id,           :aliases => 'ZoneId'
        attribute :internet_charge_type,       :aliases => 'InternetChargeType'
        attribute :serial_number,     :aliases => 'SerialNumber'
        attribute :io_optimized,      :aliases => 'IoOptimized'
        attribute :max_bandwidth_out, :aliases => 'InternetMaxBandwidthOut'
        attribute :vpc_attributes,    :aliases => 'VpcAttributes'
        attribute :device_available,  :aliases => 'DeviceAvailable'
        attribute :private_ip,        :aliases => 'PrivateIpAddress'
        attribute :security_group_ids,:aliases => 'SecurityGroupIds'
        attribute :name,              :aliases => 'InstanceName'
        attribute :description,       :aliases => 'Description'
        attribute :network_type,      :aliases => 'InstanceNetworkType'
        attribute :public_ip,         :aliases => 'PublicIpAddress'
        attribute :host_name,         :aliases => 'HostName'
        attribute :type,              :aliases => 'InstanceType'
        attribute :created_at,        :aliases => 'CreationTime'
        attribute :state,             :aliases => 'Status'
        attribute :cluster_id,        :aliases => 'ClusterId'
        attribute :region_id,         :aliases => 'RegionId'
        attribute :charge_type,       :aliases => 'InstanceChargeType'
        attribute :operation_locks,   :aliases => 'OperationLocks'
        attribute :expired_at,        :aliases => 'ExpiredTime'
        
        def image
          requires image_id
          Fog::Compute::Aliyun::Image.new(:service=>service).all(:imageId => image_id)[0]
        end

        def vpc
          requires :vpc_id
          $vpc=Fog::Compute::Aliyun::Vpcs.new(:service=>service).all('vpcId'=>vpc_id)[0]
        end

       # {"ImageId"=>"ubuntu1404_32_20G_aliaegis_20150325.vhd", "InnerIpAddress"=>{"IpAddress"=>["10.171.90.171"]},
       #  "VlanId"=>"", "InstanceId"=>"i-25d1ry3jz", 
       # "EipAddress"=>{"IpAddress"=>"", "AllocationId"=>"", "InternetChargeType"=>""}, 
       # "InternetMaxBandwidthIn"=>-1, "ZoneId"=>"cn-beijing-a", "InternetChargeType"=>"PayByTraffic", 
       # "SerialNumber"=>"9b332890-35e8-45c9-8e52-14e1156a4f58", "IoOptimized"=>false, "InternetMaxBandwidthOut"=>1, 
       # "VpcAttributes"=>{"NatIpAddress"=>"", "PrivateIpAddress"=>{"IpAddress"=>[]}, "VSwitchId"=>"", "VpcId"=>""}, 
       # "DeviceAvailable"=>true, "SecurityGroupIds"=>{"SecurityGroupId"=>["sg-25rgacf5p"]}, "InstanceName"=>"iZ25d1ry3jzZ", 
       # "Description"=>"", "InstanceNetworkType"=>"classic", "PublicIpAddress"=>{"IpAddress"=>["123.57.73.19"]}, 
       # "HostName"=>"iZ25d1ry3jzZ", "InstanceType"=>"ecs.t1.small", "CreationTime"=>"2015-10-13T14:57Z", "Status"=>"Stopped",
       #  "ClusterId"=>"", "RegionId"=>"cn-beijing", "InstanceChargeType"=>"PostPaid", "OperationLocks"=>{
       #  "LockReason"=>[{"LockReason"=>"financial"}]}, "ExpiredTime"=>"2015-10-14T20:53Z"}

        # @!attribute [rw] personality
        # @note This attribute is only used for server creation. This field will be nil on subsequent retrievals.
        # @return [Hash] Hash containing data to inject into the file system of the cloud server instance during server creation.
        # @example To inject fog.txt into file system
        #   :personality => [{ :path => '/root/fog.txt',
        #                      :contents => Base64.encode64('Fog was here!')
        #                   }]
        # @see #create
        # @see http://docs.openstack.org/api/openstack-compute/2/content/Server_Personality-d1e2543.html
       
      end
    end
  end
end
