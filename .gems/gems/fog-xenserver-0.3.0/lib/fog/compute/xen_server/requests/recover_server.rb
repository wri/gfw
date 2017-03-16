module Fog
  module Compute
    class XenServer
      class Real
        def recover_server(ref, session_to, force)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.recover" }, ref, session_to, force)
        end

        alias_method :recover_vm, :recover_server
      end
    end
  end
end
