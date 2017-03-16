module Fog
  module Storage
    class Aliyun
      class Real
        def list_objects(options={})
          bucket = options[:bucket]
          bucket ||= @aliyun_oss_bucket
          prefix = options[:prefix]
          marker = options[:marker]
          maxKeys = options[:maxKeys]
          delimiter = options[:delimiter]
          
          path = ""
          if prefix
            path+="?prefix="+prefix
            if marker
              path+="&marker="+marker
            end
            if maxKeys
              path+="&max-keys="+maxKeys
            end
            if delimiter
              path+="&delimiter="+delimiter
            end
            
          elsif marker
            path+="?marker="+marker
            if maxKeys
              path+="&max-keys="+maxKeys
            end
            if delimiter
              path+="&delimiter="+delimiter
            end
            
          elsif maxKeys
            path+="?max-keys="+maxKeys
            if delimiter
              path+="&delimiter="+delimiter
            end
          elsif delimiter
              path+="?delimiter="+delimiter
          end
          
          location = get_bucket_location(bucket)
          endpoint = "http://"+location+".aliyuncs.com"
          resource = bucket+'/'
          ret = request(
                  :expects  => [200, 203, 400],
                  :method   => 'GET',
                  :path     => path,
                  :resource => resource,
                  :bucket => bucket
          )
          xml = ret.data[:body]
          result = XmlSimple.xml_in(xml)
        end

        def list_multipart_uploads(bucket, endpoint, options = {})
          if (nil == endpoint)
            location = get_bucket_location(bucket)
            endpoint = "http://"+location+".aliyuncs.com"
          end
          path = "?uploads"
          resource = bucket+'/'+path

          ret = request(
                  :expects  => 200,
                  :method   => 'GET',
                  :path     => path,
                  :bucket   => bucket,
                  :resource => resource,
                  :endpoint => endpoint
          )
          uploadid = XmlSimple.xml_in(ret.data[:body])["Upload"]
        end

        def list_parts(bucket, object, endpoint, uploadid, options = {})
          if (nil == endpoint)
            location = get_bucket_location(bucket)
            endpoint = "http://"+location+".aliyuncs.com"
          end
          path = object+"?uploadId="+uploadid
          resource = bucket+'/'+path

          ret = request(
                  :expects  => 200,
                  :method   => 'GET',
                  :path     => path,
                  :bucket   => bucket,
                  :resource => resource,
                  :endpoint => endpoint
          )
          parts = XmlSimple.xml_in(ret.data[:body])["Part"]
        end
        
      end
      
      class Mock
        def list_objects(options={})
        end
      end
    end
  end
end
