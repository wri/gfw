module Fog
  module Compute
    class XenServer
      class Real
        def unpause_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.unpause" }, ref)
        end

        alias_method :unpause_vm, :unpause_server
      end
    end
  end
end
