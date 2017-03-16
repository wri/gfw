module Fog
  module Compute
    class XenServer
      class Real
        def db_forget_vdi(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.db_forget" }, ref)
        end
      end
    end
  end
end
