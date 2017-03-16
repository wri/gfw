module Fog
  module Compute
    class XenServer
      class Real
        def from_event(classes, token, timeout)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "event.from" }, classes, token, timeout)
        end
      end
    end
  end
end
