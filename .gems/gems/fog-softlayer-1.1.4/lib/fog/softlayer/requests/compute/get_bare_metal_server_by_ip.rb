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
        def get_bare_metal_server_by_ip(ip_address)
          response = Excon::Response.new
          response.body = @bare_metal_servers.map {|vm| vm if vm['primaryIpAddress'] == ip_address.to_s }.compact.first || {}
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
        def get_bare_metal_server_by_ip(ip_address)
          request(:hardware_server, :findByIpAddress, :body => "#{ip_address}", :http_method => :POST, :query => 'objectMask=mask[datacenter,tagReferences,memory,provisionDate,processorCoreAmount,hardDrives,datacenter,hourlyBillingFlag,operatingSystem.softwareLicense.softwareDescription.referenceCode,sshKeys.id,privateNetworkOnlyFlag,userData,frontendNetworkComponents,backendNetworkComponents]')
        end
      end
    end
  end
end