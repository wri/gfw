module Fog
  module Parsers
    module Terremark
      class GetNetworkIps< Base
        def reset
          @ip_address = {}
          @response = { "IpAddresses" => [] }
        end

        def end_element(name)
          case name
          when "Name", "Status", "Server"
            @ip_address[name.downcase] = value
          when "IpAddress"
            @response["IpAddresses"] << @ip_address
            @ip_address = {}
          end
        end
      end
    end
  end
end
