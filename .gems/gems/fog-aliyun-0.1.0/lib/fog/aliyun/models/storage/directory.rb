require 'fog/core/model'
require 'fog/aliyun/models/storage/files'

module Fog
  module Storage
    class Aliyun
      class Directory < Fog::Model
        identity  :key

        def destroy
          requires :key
          prefix = key+'/'
          ret = service.list_objects(:prefix=>prefix)["Contents"]
          
          if ret.nil?
            puts " Not found: Direction not exist!"
            false
          elsif ret.size == 1
            service.delete_container(key)
            true
          else
            raise Fog::Storage::Aliyun::Error, " Forbidden: Direction not empty!"
            false
          end
        end

        def files
          @files ||= begin
            Fog::Storage::Aliyun::Files.new(
              :directory    => self,
              :service   => service
            )
          end
        end

        def public_url
          nil
        end

        def save
          requires :key
          service.put_container(key)
          true
        end
      end
    end
  end
end
