module Fog
  module Compute
    class Ecloud
      class Real
        basic_request :ssh_key_delete, 204, "DELETE"
      end

      class Mock
        def ssh_key_delete(uri)
          ssh_key_id = id_from_uri(uri)

          data[:ssh_keys].delete(ssh_key_id)
          response(:body =>  nil, :status => 204)
        end
      end
    end
  end
end
