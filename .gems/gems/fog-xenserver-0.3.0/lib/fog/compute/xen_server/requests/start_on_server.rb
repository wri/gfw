module Fog
  module Compute
    class XenServer
      class Real
        def start_on_server(ref, host, start_paused, force)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.start_on" }, ref, host, start_paused, force)
        end

        alias_method :start_on_vm, :start_on_server
      end
    end
  end
end
