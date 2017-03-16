module Fog
  module Compute
    class XenServer
      class Real
        def dmesg_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.dmesg" }, ref)
        end
      end
    end
  end
end
