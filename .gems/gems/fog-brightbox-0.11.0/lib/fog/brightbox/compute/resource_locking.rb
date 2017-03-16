module Fog
  module Brightbox
    module Compute
      module ResourceLocking
        def locked?
          if attributes.key?("locked") || attributes.key?(:locked)
            attributes["locked"] || attributes[:locked] || false
          else
            false
          end
        end

        def lock!
          locking_request(:lock)
        end

        def unlock!
          locking_request(:unlock)
        end

        private

        def locking_request(lock_setting)
          requires :identity

          data = service.send(:"#{lock_setting}_resource_#{resource_name}", identity)
          merge_attributes(data)
          true
        end
      end
    end
  end
end
