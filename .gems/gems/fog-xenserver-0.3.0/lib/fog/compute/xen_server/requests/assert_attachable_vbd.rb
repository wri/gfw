module Fog
  module Compute
    class XenServer
      class Real
        def assert_attachable_vbd(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VBD.assert_attachable" }, ref)
        end
      end
    end
  end
end
