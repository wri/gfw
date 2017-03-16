module Fog
  module RiakCS
    module UserUtils
      def update_riakcs_user(key_id, user)
        response = @s3_connection.put_object('riak-cs', "user/#{key_id}", Fog::JSON.encode(user), { 'Content-Type' => 'application/json' })
        if !response.body.empty?
          response.body = Fog::JSON.decode(response.body)
        end
        response
      end

      def update_mock_user(key_id, user)
        if data[key_id]
          if status = user[:status]
            data[key_id][:status] = status
          end

          if user[:new_key_secret]
            data[key_id][:key_secret] = rand(100).to_s
          end

          Excon::Response.new.tap do |response|
            response.status = 200
            response.body   = data[key_id]
          end
        else
          Excon::Response.new.tap do |response|
            response.status = 403
          end
        end
      end
    end
  end
end
