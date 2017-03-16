module Fog
  module Radosgw
    module UserUtils
      def update_radosgw_user(user_id, user)
        path         = "admin/user"
        user_id      = escape(user_id)
        params       = {
            :method => 'POST',
            :path => path,
        }
        query        = "?uid=#{user_id}&format=json&suspended=#{user[:suspended]}"
        begin
          response = Excon.post("#{@scheme}://#{@host}/#{path}#{query}",
                                :headers => signed_headers(params))
          if !response.body.empty?
            case response.headers['Content-Type']
              when 'application/json'
                response.body = Fog::JSON.decode(response.body)
            end
          end
          response
        rescue Excon::Errors::NotFound => e
          raise Fog::Radosgw::Provisioning::NoSuchUser.new
        rescue Excon::Errors::BadRequest => e
          raise Fog::Radosgw::Provisioning::ServiceUnavailable.new
        end
      end

      def update_mock_user(user_id, user)
        if data[user_id]
          if suspended = user[:suspended]
            data[user_id][:suspended] = suspended
          end

          Excon::Response.new.tap do |response|
            response.status = 200
            response.body   = data[user_id]
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
