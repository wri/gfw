module Fog
  module Compute
    class XenServer
      class Real
        def forget_vdi(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.forget" }, ref)
        end
      end
    end
  end
end
