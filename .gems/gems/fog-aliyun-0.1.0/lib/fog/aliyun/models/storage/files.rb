require 'fog/core/collection'
require 'fog/aliyun/models/storage/file'

module Fog
  module Storage
    class Aliyun
      class Files < Fog::Collection
        attribute :directory
        attribute :limit
        attribute :marker
        attribute :path
        attribute :prefix

        model Fog::Storage::Aliyun::File

        def all(options = {})
          requires :directory
          if directory.key != "" && directory.key != "." && directory.key != nil
            prefix = directory.key+"/"
          end
          files = service.list_objects({:prefix => prefix})["Contents"]
          if nil == files
            return
          end
          data = Array.new
          i = 0
          files.each do |file|
            if file["Key"][0][-1] != "/"
              content_length = file["Size"][0].to_i
              key = file["Key"][0]
              lastModified = file["LastModified"][0]
              if lastModified != nil && lastModified != ""
                last_modified = (Time.parse(lastModified)).localtime
              else
                last_modified = nil
              end
              type = file["Type"][0]
              data[i] = {:content_length => content_length,
                         :key            => key,
                         :last_modified  => last_modified,
                         :etag           => file["ETag"][0],
                         :object_type    => type}
              i = i + 1
            end
          end

          load(data)
          
        end

        alias_method :each_file_this_page, :each
        def each
          if !block_given?
            self
          else
            subset = dup.all

            subset.each_file_this_page {|f| yield f}
            while subset.length == (subset.limit || 10000)
              subset = subset.all(:marker => subset.last.key)
              subset.each_file_this_page {|f| yield f}
            end

            self
          end
        end

        def get(key, &block)
          requires :directory
          if directory.key == ""
            object = key
          else
            object = directory.key+"/"+key
          end
          
          if block_given?
            pagesNum = (contentLen + Excon::CHUNK_SIZE - 1)/Excon::CHUNK_SIZE
            
            for i in 1..pagesNum
              _start = (i-1)*(Excon::CHUNK_SIZE)
              _end = i*(Excon::CHUNK_SIZE) - 1
              range = "#{_start}-#{_end}"
              data = service.get_object(object, range)
              chunk = data[:body]
              yield(chunk)
              body = nil
            end
          else
            data = service.get_object(object)
            body = data[:body]
          end
          
          contentLen = data[:headers]["Content-Length"].to_i
          if data[:status] != 200
            return nil
          end
          lastModified = data[:headers]["Last-Modified"]
          if lastModified != nil && lastModified != ""
            last_modified = (Time.parse(lastModified)).localtime
          else
            last_modified = nil
          end

          date = data[:headers]["Date"]
          if date != nil && date != ""
            date = (Time.parse(date)).localtime
          else
            date = nil
          end
          file_data = {
              :body           => body,
              :content_length => contentLen,
              :key            => key,
              :last_modified  => last_modified,
              :content_type   => data[:headers]["Content-Type"],
              :etag           => data[:headers]["ETag"],
              :date           => date,
              :connection     => data[:headers]["Connection"],
              :accept_ranges  => data[:headers]["Accept-Ranges"],
              :server         => data[:headers]["Server"],
              :object_type    => data[:headers]["x-oss-object-type"],
              :content_disposition => data[:headers]["Content-Disposition"]
          }

          new(file_data)
        end

        def get_url(key)
          requires :directory
          if directory.key == ""
            object = key
          else
            object = directory.key+"/"+key
          end
          service.get_object_http_url_public(object, 3600)
        end

        def get_http_url(key, expires, options = {})
          requires :directory
          if directory.key == ""
            object = key
          else
            object = directory.key+"/"+key
          end
          service.get_object_http_url_public(object, expires, options)
        end

        def get_https_url(key, expires, options = {})
          requires :directory
          if directory.key == ""
            object = key
          else
            object = directory.key+"/"+key
          end
          service.get_object_https_url_public(object, expires, options)
        end

        def head(key, options = {})
          requires :directory
          if directory.key == ""
            object = key
          else
            object = directory.key+"/"+key
          end
          data = service.head_object(object).data
          lastModified = data[:headers]["Last-Modified"]
          if lastModified != nil && lastModified != ""
            last_modified = (Time.parse(lastModified)).localtime
          else
            last_modified = nil
          end

          date = data[:headers]["Date"]
          if date != nil && date != ""
            date = (Time.parse(date)).localtime
          else
            date = nil
          end

          file_data = {
              :content_length => data[:headers]["Content-Length"].to_i,
              :key            => key,
              :last_modified  => last_modified,
              :content_type   => data[:headers]["Content-Type"],
              :etag           => data[:headers]["ETag"],
              :date           => date,
              :connection     => data[:headers]["Connection"],
              :accept_ranges  => data[:headers]["Accept-Ranges"],
              :server         => data[:headers]["Server"],
              :object_type    => data[:headers]["x-oss-object-type"]
          }
          new(file_data)
        rescue Fog::Storage::Aliyun::NotFound
          nil
        end

        def new(attributes = {})
          requires :directory
          super({ :directory => directory }.merge!(attributes))
        end
      end
    end
  end
end
