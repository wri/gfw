module Fog
  module Compute
    class Ecloud
      class Real
        include Shared

        def ssh_key_create(data)
          validate_data([:Name], data)

          request(
            :body => generate_ssh_key_create_request(data),
            :expects => 201,
            :method => "POST",
            :headers => {},
            :uri => data[:uri],
            :parse => true
          ).body
        end

        private

        def generate_ssh_key_create_request(data)
          xml = Builder::XmlMarkup.new
          xml.CreateSshKey(:name => data[:Name]) do
            xml.Default data[:Default]
          end
        end
      end

      class Mock
        include Shared

        def ssh_key_create(data)
          validate_data([:Name], data)
          ssh_key_id          = Fog::Mock.random_numbers(7).to_i
          ssh_key_fingerprint = ""
          (1..15).each do
            ssh_key_fingerprint = ssh_key_fingerprint + Fog::Mock.random_hex(2) + ":"
          end
          ssh_key_fingerprint = ssh_key_fingerprint + Fog::Mock.random_hex(2)
          ssh_private_key     = Fog::Mock.random_base64(512)
          org_id              = self.data[:organization_id]
          org_name            = self.data[:organization_name]

          ssh_key = {
            :href                  => "/cloudapi/ecloud/admin/sshKeys/#{ssh_key_id}",
            :Name                  => data[:Name],
            :type                  => "application/vnd.tmrk.cloud.admin.sshKey",
            :Links => {
              :Link => {
                :href => "/cloudapi/ecloud/admin/organizations/#{org_id}",
                :name => org_name,
                :type => "application/vnd.tmrk.cloud.admin.organization",
                :rel  => "up",
              },
              :Link => {
                :href => "/cloudapi/ecloud/organizations/#{org_id}",
                :name => org_name,
                :type => "application/vnd.tmrk.cloud.organization",
                :rel  => "up",
              },
            },
            :Default => data[:Default] || false,
            :FingerPrint => ssh_key_fingerprint,
            :PrivateKey => ssh_private_key,
          }

          ssh_key_response = response(:body =>  ssh_key)

          self.data[:ssh_keys][ssh_key_id] = ssh_key

          ssh_key_response.body
        end
      end
    end
  end
end
