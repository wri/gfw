module Fog
  module Compute
    class XenServer
      class Real
        def snapshot_with_quiesce_server(ref, new_name)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.snapshot_with_quiesce" }, ref, new_name)
        end

        alias_method :snapshot_with_quiesce_vm, :snapshot_with_quiesce_server
      end
    end
  end
end
