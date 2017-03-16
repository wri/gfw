module Fog
  module Compute
    class XenServer
      class Real
        def set_attribute(klass, ref, attr_name, *value)
          @connection.request({:parser => Fog::Parsers::XenServer::Base.new, :method => "#{klass}.set_#{attr_name.gsub("-","_")}"}, ref, *value)
        end
      end
    end
  end
end