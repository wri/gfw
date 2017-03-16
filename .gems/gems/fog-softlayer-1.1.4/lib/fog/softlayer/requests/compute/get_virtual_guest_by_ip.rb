#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#
module Fog
  module Compute
    class Softlayer
      class Mock
        def get_virtual_guest_by_ip(ip_address)
          response = Excon::Response.new
          response.body = @virtual_guests.map {|vm| vm if vm['primaryIpAddress'] == ip_address }.compact.first || {}
          response.status = response.body.empty? ? 404 : 200
          if response.status == 404
            response.body = {
              "error"=>"Unable to find object with ip of '#{ip_address}'.",
              "code"=>"SoftLayer_Exception_ObjectNotFound"
            }
          end
          response
        end
      end

      class Real
        def get_virtual_guest_by_ip(ip_address)
          request(:virtual_guest, :findByIpAddress, :body => "#{ip_address}", :http_method => :POST, :query => 'objectMask=mask[datacenter,tagReferences,blockDevices,blockDeviceTemplateGroup.globalIdentifier,operatingSystem.softwareLicense.softwareDescription.referenceCode,sshKeys.id,privateNetworkOnlyFlag,userData,frontendNetworkComponents,backendNetworkComponents]')
        end
      end
    end
  end
end