module Fog
  module Compute
    class Vsphere
      class Folder < Fog::Model
        identity :id

        attribute :name
        attribute :parent
        attribute :datacenter
        attribute :path
        attribute :type

        # Pass :recursive => true to get a Servers object that searches for VM names recursively
        def vms(options = {})
          return [] if type.to_s != 'vm'
          service.servers(:folder => path, :datacenter => datacenter, :recursive => options[:recursive])
        end

        def to_s
          name
        end
        
        def destroy
          service.folder_destroy(path, datacenter)
        end
      end
    end
  end
end
