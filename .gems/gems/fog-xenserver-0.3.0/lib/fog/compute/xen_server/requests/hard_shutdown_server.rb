module Fog
  module Compute
    class XenServer
      class Real
        def hard_shutdown_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.hard_shutdown" }, ref)
        end

        alias_method :hard_shutdown_vm, :hard_shutdown_server
      end
    end
  end
end
