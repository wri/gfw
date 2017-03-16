module Fog
  module Compute
    class XenServer
      class Real
        def get_current_id_event()
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "event.get_current_id" })
        end
      end
    end
  end
end
