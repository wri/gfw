module Fog
  module Compute
    class XenServer
      class Real
        def migrate_receive_host(ref, network, options)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.migrate_receive" }, ref, network, options)
        end
      end
    end
  end
end
