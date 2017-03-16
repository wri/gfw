#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

require 'fog/softlayer/models/storage/directory'

module Fog
  module Storage
    class Softlayer

      class Directories < Fog::Collection

        model Fog::Storage::Softlayer::Directory

        def all
          data = service.get_containers.body
          load(data)
        end

        def get(key, options = {})
          data = service.get_container(key, options)
          directory = new(:key => key)
          keep_headers = data.headers.select do |k,v|
            ['X-Container-Bytes-Used', 'X-Container-Object-Count', 'X-Container-Read'].include?(k)
          end
          directory.merge_attributes(keep_headers)
          directory.files.merge_attributes(options)
          directory.files.instance_variable_set(:@loaded, true)

          data.body.each do |file|
            directory.files << directory.files.new(file)
          end
          directory
        rescue Fog::Storage::Softlayer::NotFound
          nil
        end

      end

    end
  end
end
