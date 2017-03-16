module Fog
  module Compute
    class XenServer
      class Real
        def update_vdi(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.update" }, ref)
        end
      end
    end
  end
end
