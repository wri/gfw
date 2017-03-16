module Fog
  module Parsers
    module Compute
      module AWS
        class RestoreAddressToClassic < Fog::Parsers::Base
          def end_element(name)
            case name
            when 'requestId', 'publicIp', 'status'
              @response[name] = value
            end
          end
        end
      end
    end
  end
end
