module Fog
  module Compute
    class XenServer
      class Real
        def set_shutdown_delay_server(ref, value)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.set_shutdown_delay" }, ref, value)
        end

        alias_method :set_shutdown_delay_vm, :set_shutdown_delay_server
      end
    end
  end
end
