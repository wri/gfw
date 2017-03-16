module Fog
  module Compute
    class XenServer
      class Real
        def start_server(ref, start_paused = false, force = false)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.start" }, ref, start_paused, force)
        end

        alias_method :start_vm, :start_server
      end
    end
  end
end
