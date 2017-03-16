module Fog
  module Compute
    class XenServer
      class Real
        def clean_shutdown_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.clean_shutdown" }, ref)
        end

        alias_method :clean_shutdown_vm, :clean_shutdown_server
      end
    end
  end
end
