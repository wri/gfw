module Fog
  module Compute
    class XenServer
      class Real
        def get_server_certificate_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.get_server_certificate" }, ref)
        end
      end
    end
  end
end
