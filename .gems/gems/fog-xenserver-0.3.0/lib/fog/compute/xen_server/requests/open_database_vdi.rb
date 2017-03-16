module Fog
  module Compute
    class XenServer
      class Real
        def open_database_vdi(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.open_database" }, ref)
        end
      end
    end
  end
end
