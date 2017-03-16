require 'fog/digitalocean/models/paging_collection'

module Fog
  module Compute
    class DigitalOcean
      class Volumes < Fog::Compute::DigitalOcean::PagingCollection
        model Fog::Compute::DigitalOcean::Volume

        # Retrieves volumes
        # @return [Fog::Compute::DigitalOcean::Volume]
        # @raise [Fog::Compute::DigitalOcean::NotFound] - HTTP 404
        # @raise [Fog::Compute::DigitalOcean::BadRequest] - HTTP 400
        # @raise [Fog::Compute::DigitalOcean::InternalServerError] - HTTP 500
        # @raise [Fog::Compute::DigitalOcean::ServiceError]
        # @see https://developers.digitalocean.com/documentation/v2/#list-all-images
        def all(filters = {})
          data = service.list_volumes(filters)
          links = data.body["links"]
          get_paged_links(links) 
          volumes = data.body["volumes"]
          load(volumes)
        end

        # Retrieves volume
        # @param [String] id for volume to be returned
        # @return [Fog::Compute::DigitalOcean:Image]
        # @raise [Fog::Compute::DigitalOcean::NotFound] - HTTP 404
        # @raise [Fog::Compute::DigitalOcean::BadRequest] - HTTP 400
        # @raise [Fog::Compute::DigitalOcean::InternalServerError] - HTTP 500
        # @raise [Fog::Compute::DigitalOcean::ServiceError]
        # @see https://developers.digitalocean.com/documentation/v2/#retrieve-an-existing-image-by-id
        def get(id)
          volume = service.get_volume_details(id).body['volume']
          new(volume) if volume
        rescue Fog::Errors::NotFound
          nil
        end

      end
    end
  end
end
