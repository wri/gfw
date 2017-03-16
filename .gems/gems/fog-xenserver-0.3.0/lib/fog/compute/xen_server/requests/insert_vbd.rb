module Fog
  module Compute
    class XenServer
      class Real
        def insert_vbd(ref, vdi)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VBD.insert" }, ref, vdi)
        end
      end
    end
  end
end
