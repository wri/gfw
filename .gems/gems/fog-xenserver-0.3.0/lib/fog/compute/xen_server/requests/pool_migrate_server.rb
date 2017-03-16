module Fog
  module Compute
    class XenServer
      class Real
        def pool_migrate_server(ref, host, option)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.pool_migrate" }, ref, host, option)
        end

        alias_method :pool_migrate_vm, :pool_migrate_server
      end
    end
  end
end
