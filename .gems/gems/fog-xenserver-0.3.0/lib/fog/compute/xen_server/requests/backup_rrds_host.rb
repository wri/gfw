module Fog
  module Compute
    class XenServer
      class Real
        def backup_rrds_host(ref, delay)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.backup_rrds" }, ref, delay)
        end
      end
    end
  end
end
