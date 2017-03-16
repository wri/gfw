require 'fog/core/model'

module Fog
  module DNS
    class PowerDNS
      class Record < Fog::Model
        # TODO: Needs work to comply with powerdns api
        identity :name

        attribute :content
        attribute :ttl
        attribute :type
        attribute :disabled
        attribute :set_ptr

        def initialize(attributes={})
          super
        end
        def domain
          name
        end
        def destroy
          # service.delete_record(id)
          # TODO: maybe hack our own delete? this does nothing for now
          true
        end

      end
    end
  end
end