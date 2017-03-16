module Fog
  module Compute
    class Terremark
      class InternetService < Fog::Model
        identity :Id

        attribute :Name
        attribute :Port
        attribute :Protocol
        attribute :Description
        attribute :PublicIpAddress
        attribute :public_ip_address_id

        def destroy(delete_public_ip = true)
          service.delete_internet_service(self.Id)
          service.delete_public_ip(self.PublicIpAddress["Id"]) if delete_public_ip
          true
        end

        def save
          requires :Name, :Protocol, :Port
          if !public_ip_address_id
            #Create the first internet service and allocate public IP
            data = service.create_internet_service(
                vdc = service.default_vdc_id,
                name = self.Name,
                protocol = self.Protocol,
                port = self.Port,
                options = {
                  "Enabled" => "true",
                  "Description" => self.Name
                }
            )
          else
            #create additional services to existing Public IP
            data = service.add_internet_service(
                ip_id = public_ip_address_id,
                name = self.Name,
                protocol = self.Protocol,
                port = self.Port,
                options = {
                  "Enabled" => "true",
                  "Description" => self.Name
                }
            )
          end
          merge_attributes(data.body)
          true
        end
        private

        attr_writer :type, :size, :Links

        def href=(new_href)
          self.id = new_href.split("/").last.to_i
        end
      end
    end
  end
end
