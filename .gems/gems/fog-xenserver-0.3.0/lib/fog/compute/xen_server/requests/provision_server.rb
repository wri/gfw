module Fog
  module Compute
    class XenServer
      class Real
        def provision_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.provision" }, ref)
        end

        alias_method :provision_vm, :provision_server
      end
    end
  end
end
