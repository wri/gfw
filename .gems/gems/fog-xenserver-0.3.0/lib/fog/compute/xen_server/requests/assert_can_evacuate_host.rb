module Fog
  module Compute
    class XenServer
      class Real
        def assert_can_evacuate_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.assert_can_evacuate" }, ref)
        end
      end
    end
  end
end
