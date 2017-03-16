module Fog
  module Compute
    class XenServer
      class Real
        def query_data_source_host(ref, data_source)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.query_data_source" }, ref, data_source)
        end
      end
    end
  end
end
