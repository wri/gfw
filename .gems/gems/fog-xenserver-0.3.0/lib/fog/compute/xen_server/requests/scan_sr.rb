module Fog
  module Compute
    class XenServer
      class Real
        def scan_sr(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.scan" }, ref)
        end
      end
    end
  end
end
