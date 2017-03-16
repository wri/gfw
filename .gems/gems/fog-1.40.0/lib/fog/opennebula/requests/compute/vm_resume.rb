module Fog
  module Compute
    class OpenNebula
      class Real
        def vm_resume(id)
          vmpool = ::OpenNebula::VirtualMachinePool.new(client)
      	  vmpool.info!(-2,id,id,-1)

          vmpool.each do |vm|
            vm.resume
          end
        end
      end

      class Mock
        def vm_resume(id)
          self.data['vms'].each do |vm|
            if id == vm['id']
              vm['state'] = 'RUNNING'
              vm['status'] = 3
            end
          end
        end
      end
    end
  end
end
