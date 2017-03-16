module Fog
  module Compute
    class XenServer
      class Real
        def probe_sr(host, device_config, type, sm_config)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.probe" }, host, device_config, type, sm_config)
        end
      end
    end
  end
end
