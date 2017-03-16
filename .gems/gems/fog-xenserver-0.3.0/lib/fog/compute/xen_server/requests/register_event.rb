module Fog
  module Compute
    class XenServer
      class Real
        def register_event(classes)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "event.register" }, classes)
        end
      end
    end
  end
end
