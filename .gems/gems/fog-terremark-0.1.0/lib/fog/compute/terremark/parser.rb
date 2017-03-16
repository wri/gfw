module Fog
  module Compute
    class Terremark
      module Parser
        def parse(data)
          case data["type"]
          when "application/vnd.vmware.vcloud.vApp+xml"
            servers.new(data.merge!(:service => self))
          else
            data
          end
        end
      end
    end
  end
end
