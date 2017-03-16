module Fog
  module Compute
    class XenServer
      class Real
        def create_vif(config = {}, extra_params = {})
          @connection.request({:parser => Fog::Parsers::XenServer::Base.new, :method => "VIF.create"}, config )
        end
      end
    end
  end
end