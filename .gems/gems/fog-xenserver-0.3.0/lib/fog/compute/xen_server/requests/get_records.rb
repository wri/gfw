module Fog
  module Compute
    class XenServer
      class Real
        def get_records(klass, options = {})
          @connection.request(:parser => Fog::Parsers::XenServer::GetRecords.new, :method => "#{klass}.get_all_records")
        rescue Fog::XenServer::RequestFailed => e
          []
        end
      end
    end
  end
end