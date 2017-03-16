module Fog
  module Compute
    class Vsphere
      class Customfields < Fog::Collection
        autoload :Customfield, File.expand_path('../customfield', __FILE__)

        model Fog::Compute::Vsphere::Customfield

        attr_accessor :vm

        def all(filters = {})
          load service.list_customfields()
        end

        def get(key)
          load(service.list_customfields()).find do | cv |
            cv.key == ((key.is_a? String) ? key.to_i : key)
          end
        end
     end
    end
  end
end
