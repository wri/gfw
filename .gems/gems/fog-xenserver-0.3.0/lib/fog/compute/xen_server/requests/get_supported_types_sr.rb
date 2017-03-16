module Fog
  module Compute
    class XenServer
      class Real
        def get_supported_types_sr
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "SR.get_supported_types")
        end
      end
    end
  end
end
