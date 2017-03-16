module Fog
  module Compute
    class XenServer
      class Real
        def next_event()
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "event.next" })
        end
      end
    end
  end
end
