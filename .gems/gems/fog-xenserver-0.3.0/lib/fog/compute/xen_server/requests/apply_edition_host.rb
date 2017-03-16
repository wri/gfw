module Fog
  module Compute
    class XenServer
      class Real
        def apply_edition_host(ref, edition, force)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.apply_edition" }, ref, edition, force)
        end
      end
    end
  end
end
