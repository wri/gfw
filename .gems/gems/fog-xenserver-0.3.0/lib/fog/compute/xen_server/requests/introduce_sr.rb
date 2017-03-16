module Fog
  module Compute
    class XenServer
      class Real
        def introduce_sr(uuid, name_label, name_description, typecontent, sahred, sm_config)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "SR.introduce" }, uuid, name_label, name_description, typecontent, sahred, sm_config)
        end
      end
    end
  end
end
