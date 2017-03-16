module Fog
  module Compute
    class XenServer
      class Real
        def bugreport_upload_host(ref, url, options)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.bugreport_upload" }, ref, url, options)
        end
      end
    end
  end
end
