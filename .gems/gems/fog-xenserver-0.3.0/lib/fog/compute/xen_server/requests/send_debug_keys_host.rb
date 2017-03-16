module Fog
  module Compute
    class XenServer
      class Real
        def send_debug_keys_host(ref, keys)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.send_debug_keys" }, ref, keys)
        end
      end
    end
  end
end
