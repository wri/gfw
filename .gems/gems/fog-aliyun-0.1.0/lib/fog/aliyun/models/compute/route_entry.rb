require 'fog/core/model'
module Fog
  module Compute
    class Aliyun
      class RouteEntry < Fog::Model

        # "RouteTables"=>{"RouteTable"=>[
        #  {"CreationTime"=>"2015-08-03T11:23:35Z", "RouteEntrys"=>{"RouteEntry"=>[
        #    {"Status"=>"Available", "Type"=>"System", "InstanceId"=>"", "RouteTableId"=>"vtb-2504onoxh", "DestinationCidrBlock"=>"172.16.0.0/24"},
        #    {"Status"=>"Available", "Type"=>"System", "InstanceId"=>"", "RouteTableId"=>"vtb-2504onoxh", "DestinationCidrBlock"=>"172.16.1.0/24"}, 
        #    {"Status"=>"Available", "Type"=>"System", "InstanceId"=>"", "RouteTableId"=>"vtb-2504onoxh", "DestinationCidrBlock"=>"172.16.2.0/24"}, 
        #    {"Status"=>"Available", "Type"=>"System", "InstanceId"=>"", "RouteTableId"=>"vtb-2504onoxh", "DestinationCidrBlock"=>"100.64.0.0/10"}, 
        #    {"Status"=>"Available", "Type"=>"System", "InstanceId"=>"", "RouteTableId"=>"vtb-2504onoxh", "DestinationCidrBlock"=>"10.0.0.0/8"}]},
        #  "RouteTableId"=>"vtb-2504onoxh", "RouteTableType"=>"System", "VRouterId"=>"vrt-25azmd2wm"}]}
        identity :cidr_block,         :aliases => 'DestinationCidrBlock'
        attribute :state,             :aliases => 'Status'
        attribute :server_id,         :aliases => 'InstanceId'
        attribute :type,              :aliases => 'Type'
        attribute :route_table_id,    :aliases => 'RouteTableId'

        # def save
        #   requires :cidr_block,:route_table_id
        #   if(cidr_block)

      end
    end
  end
end