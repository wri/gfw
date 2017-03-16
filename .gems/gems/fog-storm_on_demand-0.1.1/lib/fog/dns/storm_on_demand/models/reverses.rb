module Fog
  module DNS
    class StormOnDemand
      class Reverses < Fog::Collection
        model Fog::DNS::StormOnDemand::Reverse

        def destroy(options)
          service.delete_reverse(options).body
        end

        def update(options)
          service.update_reverse(options).body
        end
      end
    end
  end
end
