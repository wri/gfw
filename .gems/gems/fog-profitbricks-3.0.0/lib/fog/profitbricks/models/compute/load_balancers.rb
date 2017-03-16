require File.expand_path('../load_balancer', __FILE__)
require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class LoadBalancers < Fog::Collection
        include Fog::Helpers::ProfitBricks::DataHelper
        model Fog::Compute::ProfitBricks::LoadBalancer

        def all(datacenter_id)
          result = service.get_all_load_balancers(datacenter_id)

          load_balancers = result.body['items'].each { |volume| volume['datacenter_id'] = datacenter_id }
          result.body['items'] = load_balancers

          load(result.body['items'].each { |load_balancer| flatten(load_balancer) })
        end

        def get(datacenter_id, load_balancer_id)
          response = service.get_load_balancer(datacenter_id, load_balancer_id)
          load_balancer = response.body

          load_balancer['datacenter_id'] = datacenter_id
          new(flatten(load_balancer))
        end
      end
    end
  end
end
