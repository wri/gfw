require 'fog/core/collection'
require 'fog/aliyun/models/compute/route_entry'

module Fog
  module Compute
    class Aliyun
      class RouteEntrys < Fog::Collection
        attribute :route_table

        model Fog::Compute::Aliyun::RouteEntry

        def all(options={})
          requires :route_table
          options[:routeTableId]=route_table.id
          data = Fog::JSON.decode(service.list_route_tables(route_table.v_router_id, options).body)['RouteTables']['RouteTable'][0]["RouteEntrys"]["RouteEntry"]
          load(data)
        end

        def get(cidr_block)
          requires :route_table
          data=self.class.new(:service=>service,:route_table=>route_table).all()
          result=nil
          data.each do |i|
            if i.cidr_block==cidr_block
              result=i
              break
            end
          end
          result
        end

        # def get(routeTableId)
        #   requires :v_router
        #   if routeTableId
        #     self.class.new(:service => service,:v_router=>v_router).all(:routeTableId=>routeTableId)[0]
        #   end
        # end
      end
    end
  end
end
