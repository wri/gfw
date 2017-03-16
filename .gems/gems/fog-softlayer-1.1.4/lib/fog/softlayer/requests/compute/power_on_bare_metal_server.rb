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

        # Starts a BM server
        # @param [Integer] id
        # @return [Excon::Response]
        def power_on_bare_metal_server(id)
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

        def power_on_bare_metal_server(id)
          request(:hardware_server, "#{id.to_s}/powerOn", :http_method => :GET)
        end

      end
    end
  end
end
