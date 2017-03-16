module Fog
  module Compute
    class XenServer
      class Real
        def checkpoint_server(ref, new_name)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.checkpoint" }, ref, new_name)
        end

        alias_method :checkpoint_vm, :checkpoint_server
      end
    end
  end
end
