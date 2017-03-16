require 'fog/core/collection'
require 'fog/digitalocean/models/compute/server'
require 'fog/digitalocean/models/paging_collection'

module Fog
  module Compute
    class DigitalOcean
      class Servers < Fog::Compute::DigitalOcean::PagingCollection
        model Fog::Compute::DigitalOcean::Server

        # Returns list of servers
        # @return [Fog::Compute::DigitalOceanV2::Servers]
        # @raise [Fog::Compute::DigitalOceanV2::NotFound] - HTTP 404
        # @raise [Fog::Compute::DigitalOceanV2::BadRequest] - HTTP 400
        # @raise [Fog::Compute::DigitalOceanV2::InternalServerError] - HTTP 500
        # @raise [Fog::Compute::DigitalOceanV2::ServiceError]
        # @see https://developers.digitalocean.com/documentation/v2/#droplets
        def all(filters = {})
          data = service.list_servers(filters)
          links = data.body["links"]
          get_paged_links(links) 
          droplets = data.body["droplets"]
          load(droplets)
        end

        # Retrieves server
        # @param [String] id for server to be returned
        # @return [Fog::Compute::DigitalOceanV2:Server]
        # @raise [Fog::Compute::DigitalOceanV2::NotFound] - HTTP 404
        # @raise [Fog::Compute::DigitalOceanV2::BadRequest] - HTTP 400
        # @raise [Fog::Compute::DigitalOceanV2::InternalServerError] - HTTP 500
        # @raise [Fog::Compute::DigitalOceanV2::ServiceError]
        # @see https://developers.digitalocean.com/documentation/v2/#retrieve-an-existing-droplet-by-id
        def get(id)
          server = service.get_server_details(id).body['droplet']
          new(server) if server
        rescue Fog::Errors::NotFound
          nil
        end
      end
    end
  end
end
