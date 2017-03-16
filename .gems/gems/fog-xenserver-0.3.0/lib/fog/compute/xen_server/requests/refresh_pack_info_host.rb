module Fog
  module Compute
    class XenServer
      class Real
        def refresh_pack_info_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.refresh_pack_info" }, ref)
        end
      end
    end
  end
end
