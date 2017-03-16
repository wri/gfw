#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

require 'fog/softlayer/models/storage/files'

module Fog
  module Storage
    class Softlayer

      class Directory < Fog::Model

        identity  :key, :aliases => 'name'

        attribute :bytes,   :aliases => 'X-Container-Bytes-Used'
        attribute :count,   :aliases => 'X-Container-Object-Count'
        attribute :public,  :aliases => 'X-Container-Read'

        def destroy
          requires :key
          service.delete_container(key)
          true
        rescue Excon::Errors::NotFound
          false
        end

        def files
          @files ||= begin
            Fog::Storage::Softlayer::Files.new(
              :directory    => self,
              :service   => service
            )
          end
        end

        def public=(new_public)
          attributes[:public] = new_public
        end

        def public
          !!attributes[:public]
        end
        alias_method :public?, :public

        def public_url
          requires :key
          cluster = service.cluster.downcase
          key = Fog::Softlayer.escape(self.key)
          "http://17532.http.#{cluster}.cdn.softlayer.net/#{key}"
        end

        def save
          requires :key
          service.put_container(key, public)
          true
        end

      end

    end
  end
end
