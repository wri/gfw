module Fog
  module Parsers
    module Terremark
      class Task < Base
        def reset
          @response = {}
        end

        def start_element(name, attributes)
          super
          case name
          when "Owner", "Result", "Link", "Error"
            data = extract_attributes(attributes)
            @response[name] = data
          when "Task"
            task = extract_attributes(attributes)
            @response.merge!(task.reject { |key, _value| !["endTime", "href", "startTime", "status", "type"].include?(key) })
          end
        end
      end
    end
  end
end
