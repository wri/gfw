module Fog
  module Compute
    class Vsphere
      class Real
        def get_storage_pod(name, datacenter_name)
          storage_pod = get_raw_storage_pod(name, datacenter_name)
          raise(Fog::Compute::Vsphere::NotFound) unless storage_pod
          storage_pod_attributes(storage_pod, datacenter_name)
        end

        protected

        def get_raw_storage_pod(name, datacenter_name)
          dc = find_raw_datacenter(datacenter_name)

          @connection.serviceContent.viewManager.CreateContainerView({
            :container  => dc,
            :type       => ["StoragePod"],
            :recursive  => true
          }).view.select{|pod| pod.name == name}.first
        end
      end

      class Mock
        def get_storage_pod(name, datacenter_name)
          list_storage_pods({datacenter: datacenter_name}).select{|h| h[:name] == name }.first
        end
      end
    end
  end
end
