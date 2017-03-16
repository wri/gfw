module Fog
  module Terremark
    class Vcloud
      class Real < Fog::Compute::Terremark::Real
        def initialize(options={})
          @terremark_password = options[:terremark_vcloud_password]
          @terremark_username = options[:terremark_vcloud_username]
          @connection_options = options[:connection_options] || {}
          @host       = options[:host]        || Fog::Terremark::Vcloud::HOST
          @path       = options[:path]        || Fog::Terremark::Vcloud::PATH
          @persistent = options[:persistent]  || false
          @port       = options[:port]        || Fog::Terremark::Vcloud::PORT
          @scheme     = options[:scheme]      || Fog::Terremark::Vcloud::SCHEME
          @connection = Fog::XML::Connection.new("#{@scheme}://#{@host}:#{@port}", @persistent, @connection_options)
        end

        def default_vdc_id
          if default_organization_id
            @default_vdc_id ||= begin
              vdcs = get_organization(default_organization_id).body["Links"].select do |link|
                link["type"] == "application/vnd.vmware.vcloud.vdc+xml"
              end
              if vdcs.length == 1
                vdcs.first["href"].split("/").last.to_i
              else
                nil
              end
            end
          else
            nil
          end
        end

        def default_network_id
          if default_vdc_id
            @default_network_id ||= begin
              networks = get_vdc(default_vdc_id).body["AvailableNetworks"]
              if networks.length == 1
                networks.first["href"].split("/").last.to_i
              else
                nil
              end
            end
          else
            nil
          end
        end

        def default_public_ip_id
          if default_vdc_id
            @default_public_ip_id ||= begin
              ips = get_public_ips(default_vdc_id).body["PublicIpAddresses"]
              if ips.length == 1
                ips.first["href"].split("/").last.to_i
              else
                nil
              end
            end
          else
            nil
          end
        end
      end
    end
  end
end
