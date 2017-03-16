module Fog
  module Compute
    class ProfitBricks
      class Real
        # Deletes the specified load balancer
        #
        # ==== Parameters
        # * datacenter_id<~String>   - UUID of the data center
        # * load_balancer_id<~String> - UUID of the load balancer
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#delete-load-balancer]
        def delete_load_balancer(datacenter_id, load_balancer_id)
          request(
            :expects => [202],
            :method  => 'DELETE',
            :path    => "/datacenters/#{datacenter_id}/loadbalancers/#{load_balancer_id}"
          )
        end
      end

      class Mock
        def delete_load_balancer(datacenter_id, load_balancer_id)
          response = Excon::Response.new
          response.status = 202

          if lb = data[:load_balancers]["items"].find do |attribute|
            attribute["datacenter_id"] == datacenter_id && attribute["id"] == load_balancer_id
          end
          else
            raise Fog::Errors::NotFound, "The requested resource could not be found"
          end

          response
        end
      end
    end
  end
end
