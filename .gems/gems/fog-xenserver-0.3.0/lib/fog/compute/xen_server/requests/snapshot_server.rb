module Fog
  module Compute
    class XenServer
      class Real
        def snapshot_server(ref, new_name)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.snapshot" }, ref, new_name)
        end

        alias_method :snapshot_vm, :snapshot_server
      end
    end
  end
end
