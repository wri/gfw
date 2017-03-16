module Fog
  module Compute
    class XenServer
      class Real
        def query_data_source_server(ref, data_source)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VM.query_data_source" }, ref, data_source)
        end

        alias_method :query_data_source_vm, :query_data_source_server
      end
    end
  end
end
