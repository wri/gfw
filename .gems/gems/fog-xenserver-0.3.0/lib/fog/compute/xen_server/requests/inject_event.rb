module Fog
  module Compute
    class XenServer
      class Real
        def inject_event(klass, object_ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "event.inject" }, klass, object_ref)
        end
      end
    end
  end
end
