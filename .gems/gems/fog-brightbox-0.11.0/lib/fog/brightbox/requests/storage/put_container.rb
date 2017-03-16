module Fog
  module Storage
    class Brightbox
      class Real
        # Create a new container
        #
        # ==== Parameters
        # * name<~String> - Name for container, should be < 256 bytes and must not contain '/'
        #
        def put_container(name, options = {})
          headers = options[:headers] || {}
          headers["X-Container-Read"] ||= options.delete(:read_permissions)
          headers["X-Container-Write"] ||= options.delete(:write_permissions)

          request(
            :expects  => [201, 202],
            :method   => "PUT",
            :path     => Fog::Storage::Brightbox.escape(name),
            :headers  => headers
          )
        end
      end
    end
  end
end
