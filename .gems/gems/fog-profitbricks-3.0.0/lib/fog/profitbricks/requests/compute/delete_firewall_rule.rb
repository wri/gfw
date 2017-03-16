module Fog
  module Compute
    class ProfitBricks
      class Real
        # Deletes the specified firewall rule
        #
        # ==== Parameters
        # * datacenter_id<~String>   - UUID of the data center
        # * server_id<~String>        - UUID of the server
        # * nic_id<~String>           - UUID of the NIC
        # * firewall_rule_id<~String> - UUID of the NIC
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#delete-firewall-rule]
        def delete_firewall_rule(datacenter_id, server_id, nic_id, firewall_rule_id)
          request(
            :expects => [202],
            :method  => 'DELETE',
            :path    => "/datacenters/#{datacenter_id}/servers/#{server_id}/nics/#{nic_id}/firewallrules/#{firewall_rule_id}"
          )
        end
      end

      class Mock
        def delete_firewall_rule(datacenter_id, server_id, nic_id, firewall_rule_id)
          response = Excon::Response.new
          response.status = 202

          if firewall_rule = data[:firewall_rules]["items"].find do |attribute|
            attribute["datacenter_id"] == datacenter_id && attribute["server_id"] == server_id && attribute["nic_id"] == nic_id && attribute["id"] == firewall_rule_id
          end
          else
            raise Fog::Errors::NotFound, "The requested firewall rule resource could not be found"
          end

          response
        end
      end
    end
  end
end
