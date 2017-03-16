module Fog
  module Compute
    class DigitalOcean
      # noinspection RubyStringKeysInHashInspection
      class Real

        def create_volume(options={})
          create_options = {
            :name        => "name",
            :region      => "nyc1",
            :size_gigabytes => 1
          }.merge(options)

          encoded_body = Fog::JSON.encode(create_options)

          request(
            :expects => [201],
            :headers => {
              'Content-Type' => "application/json; charset=UTF-8",
            },
            :method  => 'POST',
            :path    => '/v2/volumes',
            :body    => encoded_body,
          )
        end
      end

      # noinspection RubyStringKeysInHashInspection
      class Mock
        def create_volume(options)
          response        = Excon::Response.new
          response.status = 201

          response.body ={
            'volume' => {
              "id" => Fog::Mock.random_numbers(6).to_i,
              "fingerprint" => (["00"] * 16).join(':'),
              "region" => options[:region], 
              "size_gigabytes" => 10,
              "description" => options[:description],
              "name" => options[:name]
            }
          }

          response
        end
      end
    end
  end
end
