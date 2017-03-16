#
# Author:: Manuel David Franco Barrios (<mafraba@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#
module Fog
  module Compute
    class Softlayer

      class Mock

        # Reboots a BM server
        # @param [Integer] id
        # @return [Excon::Response]
        def reboot_bare_metal_server(id, use_hard_reboot)
          response = Excon::Response.new
          response.status = 200
          found = self.get_bare_metal_servers.body.map{|server| server['id']}.include?(id)
          if not found
            response.status = 404
            response.body = {
              "error" => "Unable to find object with id of '#{id}'.",
              "code" => "SoftLayer_Exception_ObjectNotFound"
            }
          else
            response.body = true
          end
          response
        end
      end

      class Real

        def reboot_bare_metal_server(id, use_hard_reboot)
          if use_hard_reboot
            request(:hardware_server, "#{id.to_s}/rebootHard", :http_method => :GET)
          else
            request(:hardware_server, "#{id.to_s}/rebootSoft", :http_method => :GET)
          end
        end

      end
    end
  end
end
