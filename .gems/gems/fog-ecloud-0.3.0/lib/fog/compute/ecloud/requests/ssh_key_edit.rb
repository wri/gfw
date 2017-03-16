module Fog
  module Compute
    class Ecloud
      class Real
        include Shared

        def ssh_key_edit(data)
          request(
            :body => generate_ssh_key_edit_request(data),
            :expects => 200,
            :method => "PUT",
            :headers => {},
            :uri => data[:uri],
            :parse => true
          ).body
        end

        private

        def generate_ssh_key_edit_request(data)
          xml = Builder::XmlMarkup.new
          xml.SshKey(:name => data[:Name]) do
            xml.Default data[:Default]
          end
        end
      end

      class Mock
        def ssh_key_edit(options)
          ssh_key_id = id_from_uri(options[:uri]).to_i
          if data[:ssh_keys][ssh_key_id]
            data[:ssh_keys][ssh_key_id][:Name] = options[:Name]
            data[:ssh_keys][ssh_key_id][:Default] = options[:Default]
            ssh_key = data[:ssh_keys][ssh_key_id]
            response(:body => Fog::Ecloud.slice(ssh_key, :id, :admin_organization)).body
          else
            body = "<Error message=\"Resource Not Found\" majorErrorCode=\"404\" minorErrorCode=\"ResourceNotFound\" />"
            response(:body => body, :expects => 200, :status => 404)
          end
        end
      end
    end
  end
end
