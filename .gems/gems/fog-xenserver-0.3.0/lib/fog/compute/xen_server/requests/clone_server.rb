module Fog
  module Compute
    class XenServer
      class Real
        def clone_server(ref, new_name)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.clone" }, ref, new_name)
        end

        alias_method :clone_vm, :clone_server
      end
    end
  end
end
