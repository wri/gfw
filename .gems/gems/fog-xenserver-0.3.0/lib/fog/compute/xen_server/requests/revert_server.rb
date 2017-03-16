module Fog
  module Compute
    class XenServer
      class Real
        def revert_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.revert" }, ref)
        end

        alias_method :revert_vm, :revert_server
      end
    end
  end
end
