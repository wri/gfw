module Fog
  module Compute
    class XenServer
      module Models
        class Model < Fog::Model
          extend ClassMethods
          include InstanceMethods
        end
      end
    end
  end
end
