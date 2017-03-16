module Fog
  module Compute
    class XenServer
      class Real
        def get_log_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.get_log" }, ref)
        end
      end
    end
  end
end
