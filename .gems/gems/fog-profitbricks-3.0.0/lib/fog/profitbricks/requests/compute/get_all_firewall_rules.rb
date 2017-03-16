module Fog
  module Compute
    class ProfitBricks
      class Real
        # Retrieves a list of firewall rules associated with a particular NIC
        #
        # ==== Parameters
        # * datacenter_id<~String> - UUID of the datacenter
        # * server_id<~String>      - UUID of the server
        # * nic_id<~String>         - UUID of the NIC
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String> 		  - The resource's unique identifier
        #     * type<~String>		  - The type of the created resource
        #     * href<~String>		  - URL to the object’s representation (absolute path)
        #     * items<~Hash>      - Collection of individual Firewall Rule objects
        #       * id<~String> 		  - The resource's unique identifier
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
        #         * protocol<~String>         - The protocol for the rule: TCP, UDP, ICMP, ANY
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
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#list-firewall-rules]
        def get_all_firewall_rules(datacenter_id, server_id, nic_id)
          request(
            :expects => [200],
            :method  => 'GET',
            :path    => "/datacenters/#{datacenter_id}/servers/#{server_id}/nics/#{nic_id}/firewallrules?depth=5"
          )
        end
      end

      class Mock
        def get_all_firewall_rules(datacenter_id, server_id, nic_id)
          firewall_rules = data[:firewall_rules]

          if nics = data[:firewall_rules]['items'].select do |attrib|
            attrib['datacenter_id'] == datacenter_id && attrib['server_id'] == server_id && attrib['nic_id'] == nic_id
          end
          else
            raise Fog::Errors::NotFound, 'The resource could not be found'
          end

          firewall_rules['items'] = nics
          response        = Excon::Response.new
          response.status = 200
          response.body   = firewall_rules

          response
        end
      end
    end
  end
end
