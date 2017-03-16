require 'fog/openstack/models/collection'
require 'fog/image/openstack/v1/models/image'

module Fog
  module Image
    class OpenStack
      class V1
        class Images < Fog::OpenStack::Collection
          model Fog::Image::OpenStack::V1::Image

          def all(options = {})
            load_response(service.list_public_images_detailed(options), 'images')
          end

          def summary(options = {})
            load_response(service.list_public_images(options), 'images')
          end

          def details(options = {}, deprecated_query = nil)
            Fog::Logger.deprecation("Calling OpenStack[:glance].images.details will be removed, "\
                                    " call .images.all for detailed list.")
            load_response(service.list_public_images_detailed(options, deprecated_query), 'images')
          end

          def find_by_id(id)
            marker = 'X-Image-Meta-'
            params = service.get_image_by_id(id).headers.select{|h,_| h.include?(marker) }
            params = params.map{|k,v| [k.gsub(marker,'').downcase, convert_to_type(v)]}
            new(Hash[params])
          rescue Fog::Image::OpenStack::NotFound
            nil
          end
          alias get find_by_id

          def public
            images = load(service.list_public_images_detailed.body['images'])
            images.delete_if { |image| image.is_public == false }
          end

          def private
            images = load(service.list_public_images_detailed.body['images'])
            images.delete_if(&:is_public)
          end

          def destroy(id)
            image = find_by_id(id)
            image.destroy
          end

          def method_missing(method_sym, *arguments, &block)
            if method_sym.to_s =~ /^find_by_(.*)$/
              load(service.list_public_images_detailed($1, arguments.first).body['images'])
            else
              super
            end
          end

          def find_by_size_min(size)
            find_attribute(__method__, size)
          end

          def find_by_size_max(size)
            find_attribute(__method__, size)
          end

          def find_attribute(attribute, value)
            attribute = attribute.to_s.gsub("find_by_", "")
            load(service.list_public_images_detailed(attribute, value).body['images'])
          end

          private

          def convert_to_type(v)
            case v
            when /^\d+$/
              v.to_i
            when 'True'
              true
            when 'False'
              false
            when /^\d\d\d\d\-\d\d\-\d\dT/
              ::Time.parse(v)
            else
              v
            end
          end
        end
      end
    end
  end
end
