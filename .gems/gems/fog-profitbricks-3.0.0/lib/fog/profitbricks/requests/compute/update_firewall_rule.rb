module Fog
  module Compute
    class ProfitBricks
      class Real
        # Update a Firewall Rule
        #
        # ==== Parameters
        # * datacenter_id<~String>   - Required - UUID of the NIC
        # * server_id<~String>        - Required - UUID of the server
        # * nic_id<~String>           - Required - UUID of the NIC
        # * firewall_rule_id<~String> - Required - UUID of the NIC
        # * options<~Hash>:
        #   * name<~String>             - The name of the Firewall Rule
        #   * sourceMac<~String>        - Only traffic originating from the respective MAC address is allowed.
        #                                 Valid format: aa:bb:cc:dd:ee:ff. Value null allows all source MAC address
        #   * sourceIp<~String>         - Only traffic originating from the respective IPv4 address is allowed. Value null allows all source IPs
        #   * targetIp<~String>         - In case the target NIC has multiple IP addresses, only traffic directed
        #                                 to the respective IP address of the NIC is allowed. Value null allows all target IPs
        #   * icmpCode<~String>         - Defines the allowed code (from 0 to 254) if protocol ICMP is chosen. Value null allows all codes
        #   * icmpType<~String>         - Defines the allowed type (from 0 to 254) if the protocol ICMP is chosen. Value null allows all types
        #   * portRangeStart<~String>   - Defines the start range of the allowed port (from 1 to 65534) if protocol TCP or UDP is chosen.
        #                                 Leave portRangeStart and portRangeEnd value null to allow all ports
        #   * portRangeEnd<~String>     - Defines the end range of the allowed port (from 1 to 65534) if the protocol TCP or UDP is chosen.
        #                                 Leave portRangeStart and portRangeEnd null to allow all ports
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String> 		  - The resource's unique identifier
        #       * type<~String>		  - The type of the created resource
        #       * href<~String>		  - URL to the object’s representation (absolute path)
        #       * metadata<~Hash>	  - Hash containing the Firewall Rule metadata
        #         * createdDate<~String>		  - The date the resource was created
        #         * createdBy<~String>		    - The user who created the resource
        #         * etag<~String>				      - The etag for the resource
        #         * lastModifiedDate<~String>	- The last time the resource has been modified
        #         * lastModifiedBy<~String>	  - The user who last modified the resource
        #         * state<~String>            - Firewall Rule state
        #       * properties<~Hash> - Hash containing the Firewall Rule properties
        #         * name<~String>             - The name of the Firewall Rule
        #         * sourceMac<~String>        - Only traffic originating from the respective MAC address is allowed.
        #                                       Valid format: aa:bb:cc:dd:ee:ff. Value null allows all source MAC address
        #         * sourceIp<~String>         - Only traffic originating from the respective IPv4 address is allowed. Value null allows all source IPs
        #         * targetIp<~String>         - In case the target NIC has multiple IP addresses, only traffic directed
        #                                       to the respective IP address of the NIC is allowed. Value null allows all target IPs
        #         * icmpCode<~String>         - Defines the allowed code (from 0 to 254) if protocol ICMP is chosen. Value null allows all codes
        #         * icmpType<~String>         - Defines the allowed type (from 0 to 254) if the protocol ICMP is chosen. Value null allows all types
        #         * portRangeStart<~String>   - Defines the start range of the allowed port (from 1 to 65534) if protocol TCP or UDP is chosen.
        #                                       Leave portRangeStart and portRangeEnd value null to allow all ports
        #         * portRangeEnd<~String>     - Defines the end range of the allowed port (from 1 to 65534) if the protocol TCP or UDP is chosen.
        #                                       Leave portRangeStart and portRangeEnd null to allow all ports
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#update-firewall-rule]
        def update_firewall_rule(datacenter_id, server_id, nic_id, firewall_rule_id, options = {})
          request(
            :expects => [202],
            :method  => 'PATCH',
            :path    => "/datacenters/#{datacenter_id}/servers/#{server_id}/nics/#{nic_id}/firewallrules/#{firewall_rule_id}",
            :body    => Fog::JSON.encode(options)
          )
        end
      end

      class Mock
        def update_firewall_rule(datacenter_id, server_id, nic_id, firewall_rule_id, options = {})
          if firewall_rule = data[:firewall_rules]['items'].find do |attribute|
            attribute["datacenter_id"] == datacenter_id && attribute["server_id"] == server_id && attribute["nic_id"] == nic_id && attribute["id"] == firewall_rule_id
          end
            options.each do |key, value|
              firewall_rule[key] = value
            end
          else
            raise Fog::Errors::NotFound, 'The requested resource could not be found'
          end

          response        = Excon::Response.new
          response.status = 202
          response.body   = firewall_rule

          response
        end
      end
    end
  end
end
