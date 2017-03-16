require 'fog/core/collection'
require 'fog/aliyun/models/compute/security_group'

module Fog
  module Compute
    class Aliyun
      class SecurityGroups < Fog::Collection
        model Fog::Compute::Aliyun::SecurityGroup

        def all(options={})
          data = Fog::JSON.decode(service.list_security_groups(options).body)['SecurityGroups']['SecurityGroup']
          load(data)
          #['Images']['Image']
        end

        def get(security_group_id)
          if security_group_id
            data=self.class.new(:service=>service).all()
            result=nil
            data.each do |i|
              if(i.id==security_group_id)
                result=i
                break
              end
            end
            result
          end
        end

      end
    end
  end
end
