module Fog
  module Compute
    class XenServer
      class Real
        def pause_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.pause" }, ref)
        end

        alias_method :pause_vm, :pause_server
      end
    end
  end
end
