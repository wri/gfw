module Fog
  module Compute
    class XenServer
      class Real
        def forget_data_source_archives_host(ref, data_source)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.forget_data_source_archives" }, ref, data_source)
        end
      end
    end
  end
end
