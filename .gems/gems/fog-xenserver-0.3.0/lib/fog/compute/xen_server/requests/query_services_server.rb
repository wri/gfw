module Fog
  module Compute
    class XenServer
      class Real
        def query_services_server(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.query_services" }, ref)
        end

        alias_method :query_services_vm, :query_services_server
      end
    end
  end
end
