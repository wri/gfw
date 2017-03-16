module Fog
  module Compute
    class XenServer
      class Real
        def send_trigger_server(ref, trigger)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.send_trigger" }, ref, trigger)
        end

        alias_method :send_trigger_vm, :send_trigger_server
      end
    end
  end
end
