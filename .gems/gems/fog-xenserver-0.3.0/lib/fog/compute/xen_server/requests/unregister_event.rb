module Fog
  module Compute
    class XenServer
      class Real
        def unregister_event(classes)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "event.unregister" }, classes)
        end
      end
    end
  end
end
