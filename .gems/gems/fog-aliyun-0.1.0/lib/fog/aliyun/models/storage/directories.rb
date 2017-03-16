require 'fog/core/collection'
require 'fog/aliyun/models/storage/directory'

module Fog
  module Storage
    class Aliyun
      class Directories < Fog::Collection
        model Fog::Storage::Aliyun::Directory

        def all
          containers = service.get_containers()
          if nil == containers
            return nil
          end
          data = Array.new
          i = 0
          containers.each do |entry|
            key = entry["Prefix"][0]
            key[-1] = ''
            data[i] = {:key=>key}
            i = i + 1
          end

          load(data)
        end

        def get(key, options = {})
          if key != nil && key != "" && key != '.'
            dir = key+'/'
            ret = service.head_object(dir, options)
            if ret.data[:status] == 200
              new(:key => key)
            else
              nil
            end
          else
            new(:key => "")
          end
        rescue Fog::Storage::Aliyun::NotFound
          nil
        end
      end
    end
  end
end
