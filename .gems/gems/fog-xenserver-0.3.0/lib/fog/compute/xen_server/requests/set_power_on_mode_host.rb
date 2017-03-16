module Fog
  module Compute
    class XenServer
      class Real
        def set_power_on_mode_host(ref, power_on_mode, power_on_config)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.set_power_on_mode" }, ref, power_on_mode, power_on_config)
        end
      end
    end
  end
end
