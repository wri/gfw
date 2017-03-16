module Fog
  module Compute
    class XenServer
      class Real
        def get_vms_which_prevent_evacuation_host(ref)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "host.get_vms_which_prevent_evacuation" }, ref)
        end
      end
    end
  end
end
