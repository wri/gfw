module Fog
  module Compute
    class XenServer
      class Real
        def create_network(config = {}, extra_params = {})
          @connection.request({:parser => Fog::Parsers::XenServer::Base.new, :method => "network.create" }, config)
        end
      end
    end
  end
end