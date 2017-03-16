module Fog
  module Compute
    class Vsphere
      class Hosts < Fog::Collection
        attribute :datacenter
        attribute :cluster

        model Fog::Compute::Vsphere::Host

        def all(filters = {})
          requires :datacenter, :cluster
          load service.list_hosts(:datacenter => datacenter, :cluster => cluster)
        end

        def get(name)
          all.find { |host| host.name == name } or
            raise Fog::Compute::Vsphere::NotFound, "no such host #{name}"
        end
      end
    end
  end
end
