module Fog
  module Compute
    class XenServer
      class Real
        def suspend_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.suspend" }, ref)
        end

        alias_method :suspend_vm, :suspend_server
      end
    end
  end
end
