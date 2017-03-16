module Fog
  module Compute
    class ProfitBricks
      class Real
        # Associates a NIC to a Load Balancer, enabling the NIC to participate in load-balancing
        #
        # ==== Parameters
        # * datacenter_id<~String>   - UUID of the data center
        # * load_balancer_id<~String> - UUID of the load balancer
        # * nic_id<~String>           - UUID of the NIC
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#remove-a-nic-association]
        def remove_nic_association(datacenter_id, load_balancer_id, nic_id)
          request(
            :expects => [202],
            :method  => 'DELETE',
            :path    => "/datacenters/#{datacenter_id}/loadbalancers/#{load_balancer_id}/balancednics/#{nic_id}"
          )
        end
      end

      class Mock
        def remove_nic_association(datacenter_id, load_balancer_id, _nic_id)
          if load_balancer = data[:load_balancers]['items'].find do |lb|
            lb["datacenter_id"] == datacenter_id && lb["id"] == load_balancer_id
          end
          else
            raise Fog::Errors::NotFound, "The requested resource could not be found"
          end

          response        = Excon::Response.new
          response.status = 202
          response
        end
      end
    end
  end
end
