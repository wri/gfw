module Fog
  module Compute
    class XenServer
      class Real
        def emergency_transition_to_master_pool
          @connection.request(:parser => Fog::Parsers::XenServer::Base.new, :method => "pool.emergency_transition_to_master")
        end
      end
    end
  end
end
