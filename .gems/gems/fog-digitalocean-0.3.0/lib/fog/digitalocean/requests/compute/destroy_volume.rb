module Fog
  module Compute
    class DigitalOcean
      # noinspection RubyStringKeysInHashInspection
      class Real
        def destroy_volume(id)
          request(
            :expects => [204],
            :headers => {
              'Content-Type' => "application/json; charset=UTF-8",
            },
            :method  => 'DELETE',
            :path    => "/v2/volumes/#{id}",
          )
        end
      end

      # noinspection RubyStringKeysInHashInspection
      class Mock
        def destroy_volume(id)
          self.data[:volumes].select! do |key|
            key["id"] != id
          end

          response        = Excon::Response.new
          response.status = 204
          response
        end
      end
    end
  end
end
