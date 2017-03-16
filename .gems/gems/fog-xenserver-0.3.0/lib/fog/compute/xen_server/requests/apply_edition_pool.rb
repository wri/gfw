module Fog
  module Compute
    class XenServer
      class Real
        def apply_edition_pool(ref, edition)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "pool.apply_edition" }, ref, edition)
        end
      end
    end
  end
end
