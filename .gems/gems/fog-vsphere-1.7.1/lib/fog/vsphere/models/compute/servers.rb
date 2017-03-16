module Fog
  module Compute
    class Vsphere
      class Servers < Fog::Collection
        autoload :Server, File.expand_path('../server', __FILE__)

        model Fog::Compute::Vsphere::Server
        attr_accessor :datacenter
        attr_accessor :network
        attr_accessor :cluster
        attr_accessor :resource_pool
        attr_accessor :folder
        attr_accessor :recursive

        # 'folder' => '/Datacenters/vm/Jeff/Templates' will be MUCH faster.
        # than simply listing everything.
        def all(filters = { })
          f = {
            :datacenter    => datacenter,
            :cluster       => cluster,
            :network       => network,
            :resource_pool => resource_pool,
            :folder        => folder,
            :recursive     => recursive,
          }.merge(filters)

          load service.list_virtual_machines(f)
        end

        def get(id, datacenter = nil)
          new service.get_virtual_machine id, datacenter, folder, recursive
        rescue Fog::Compute::Vsphere::NotFound
          nil
        end
        
        # Pass attributes we know about down to any VM we're creating
        def new(attributes = {})
          super({
            :datacenter    => datacenter,
            :path          => folder,
            :cluster       => cluster,
            :resource_pool => resource_pool,
          }.merge(attributes))
        end
        
      end
    end
  end
end
