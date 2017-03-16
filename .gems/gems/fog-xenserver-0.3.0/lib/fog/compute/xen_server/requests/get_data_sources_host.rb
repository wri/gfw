module Fog
  module Compute
    class XenServer
      class Real
        def get_data_sources_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.get_data_sources" }, ref)
        end
      end
    end
  end
end
