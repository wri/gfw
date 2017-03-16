module Fog
  module Compute
    class Aliyun < Fog::Service
      recognizes :aliyun_url, 
                 :aliyun_accesskey_id, 
                 :aliyun_accesskey_secret,
                 :aliyun_region_id,
                 :aliyun_zone_id

      ## MODELS
      #
      model_path 'fog/aliyun/models/compute'
      model       :server
      collection  :servers
      model       :image
      collection  :images
      model       :eip_address
      collection  :eip_addresses
      model       :security_group
      collection  :security_groups
      model       :security_group_rule
      collection  :security_group_rules
      model       :volume
      collection  :volumes
      model       :snapshot
      collection  :snapshots
      model       :vpc
      collection  :vpcs
      model       :vswitch
      collection  :vswitches
      model       :vrouter
      collection  :vrouters
      model       :route_table
      collection  :route_tables
      model       :route_entry
      collection  :route_entrys

      ## REQUESTS
      #
      request_path 'fog/aliyun/requests/compute'


      # Server CRUD
      request :list_servers
      request :list_server_types
      request :create_server
      request :delete_server


      # Server Actions
      request :reboot_server
      request :start_server
      request :stop_server


      #SnapShoot CRUD
      request :list_snapshots
      request :create_snapshot
      request :delete_snapshot


      # Image CRUD
      request :list_images
      request :create_image
      request :delete_image


      # Eip
      request :list_eip_addresses
      request :allocate_eip_address
      request :release_eip_address
      request :associate_eip_address
      request :unassociate_eip_address


      # Security Group
      request :list_security_groups
      request :list_security_group_rules
      request :create_security_group
      request :create_security_group_ip_rule
      request :create_security_group_sg_rule
      request :create_security_group_egress_ip_rule
      request :create_security_group_egress_sg_rule
      request :delete_security_group
      request :delete_security_group_ip_rule
      request :delete_security_group_sg_rule
      request :delete_security_group_egress_ip_rule
      request :delete_security_group_egress_sg_rule
      request :join_security_group
      request :leave_security_group


      # Zones
      request :list_zones

      
      # VPC
      request :create_vpc
      request :delete_vpc
      request :list_vpcs
      request :create_vswitch
      request :delete_vswitch
      request :list_vswitchs
      request :modify_vpc
      request :modify_vswitch

      #VRouter
      request :list_vrouters

      #RouteTable
      request :list_route_tables

      
      #clouddisk
      request :list_disks
      request :create_disk
      request :delete_disk
      request :attach_disk
      request :detach_disk


      class Mock
        attr_reader :auth_token
        attr_reader :auth_token_expiration
        attr_reader :current_user
        attr_reader :current_tenant

        def self.data
          @data ||= Hash.new do |hash, key|
            hash[key] = {
              :last_modified => {
                :images  => {},
                :servers => {},
                :key_pairs => {},
                :security_groups => {},
                :addresses => {}
              },
              :images  => {
                "0e09fbd6-43c5-448a-83e9-0d3d05f9747e" => {
                  "id"=>"0e09fbd6-43c5-448a-83e9-0d3d05f9747e",
                  "name"=>"cirros-0.3.0-x86_64-blank",
                  'progress'  => 100,
                  'status'    => "ACTIVE",
                  'updated'   => "",
                  'minRam'    => 0,
                  'minDisk'   => 0,
                  'metadata'  => {},
                  'links'     => [{"href"=>"http://nova1:8774/v1.1/admin/images/1", "rel"=>"self"}, {"href"=>"http://nova1:8774/admin/images/2", "rel"=>"bookmark"}]
                }
              },
              :servers => {},
              :key_pairs => {},
              :security_groups => {
                '0' => {
                  "id"          => 0,
                  "tenant_id"   => Fog::Mock.random_hex(8),
                  "name"        => "default",
                  "description" => "default",
                  "rules"       => [
                    { "id"              => 0,
                      "parent_group_id" => 0,
                      "from_port"       => 68,
                      "to_port"         => 68,
                      "ip_protocol"     => "udp",
                      "ip_range"        => { "cidr" => "0.0.0.0/0" },
                      "group"           => {}, },
                  ],
                },
              },
              :server_security_group_map => {},
              :addresses => {},
              :quota => {
                'security_group_rules' => 20,
                'security_groups' => 10,
                'injected_file_content_bytes' => 10240,
                'injected_file_path_bytes' => 256,
                'injected_files' => 5,
                'metadata_items' => 128,
                'floating_ips'   => 10,
                'instances'      => 10,
                'key_pairs'      => 10,
                'gigabytes'      => 5000,
                'volumes'        => 10,
                'cores'          => 20,
                'ram'            => 51200
              },
              :volumes => {}
            }
          end
        end

        def self.reset
          @data = nil
        end

        def initialize(options={})
          @openstack_username = options[:openstack_username]
          @openstack_user_domain = options[:openstack_user_domain] || options[:openstack_domain]
          @openstack_project_domain  = options[:openstack_project_domain]  || options[:openstack_domain] || 'Default'
          @openstack_auth_uri = URI.parse(options[:openstack_auth_url])

          @current_tenant = options[:openstack_tenant]
          @current_tenant_id = options[:openstack_tenant_id]

          @auth_token = Fog::Mock.random_base64(64)
          @auth_token_expiration = (Time.now.utc + 86400).iso8601

          management_url = URI.parse(options[:openstack_auth_url])
          management_url.port = 8774
          management_url.path = '/v1.1/1'
          @openstack_management_url = management_url.to_s

          identity_public_endpoint = URI.parse(options[:openstack_auth_url])
          identity_public_endpoint.port = 5000
          @openstack_identity_public_endpoint = identity_public_endpoint.to_s
        end

        def data
          self.class.data["#{@openstack_username}-#{@current_tenant}"]
        end

        def reset_data
          self.class.data.delete("#{@openstack_username}-#{@current_tenant}")
        end

        def credentials
          { :provider                 => 'openstack',
            :openstack_auth_url       => @openstack_auth_uri.to_s,
            :openstack_auth_token     => @auth_token,
            :openstack_management_url => @openstack_management_url,
            :openstack_identity_endpoint => @openstack_identity_public_endpoint }
        end
      end

      class Real

        # Initialize connection to ECS
        #
        # ==== Notes
        # options parameter must include values for :aliyun_url, :aliyun_accesskey_id,
        # :aliyun_secret_access_key, :aliyun_region_id and :aliyun_zone_id in order to create a connection.
        # if you haven't set these values in the configuration file.
        #
        # ==== Examples
        #   sdb = Fog::Compute.new(:provider=>'aliyun',
        #    :aliyun_accesskey_id => your_:aliyun_accesskey_id,
        #    :aliyun_secret_access_key => your_aliyun_secret_access_key
        #   )
        #
        # ==== Parameters
        # * options<~Hash> - config arguments for connection.  Defaults to {}.
        #
        # ==== Returns
        # * ECS object with connection to aliyun.
        attr_reader :aliyun_accesskey_id
        attr_reader :aliyun_accesskey_secret
        attr_reader :aliyun_region_id
        attr_reader :aliyun_url
        attr_reader :aliyun_zone_id

        def initialize(options={})

          #initialize the parameters
          @aliyun_url              = options[:aliyun_url]
          @aliyun_accesskey_id     = options[:aliyun_accesskey_id]
          @aliyun_accesskey_secret = options[:aliyun_accesskey_secret]
          @aliyun_region_id        = options[:aliyun_region_id]
          @aliyun_zone_id          = options[:aliyun_zone_id]

          #check for the parameters
          missing_credentials = Array.new
          missing_credentials << :aliyun_accesskey_id  unless @aliyun_accesskey_id
          missing_credentials << :aliyun_accesskey_secret unless @aliyun_accesskey_secret
          missing_credentials << :aliyun_region_id unless @aliyun_region_id
          missing_credentials << :aliyun_url unless @aliyun_url
          missing_credentials << :aliyun_zone_id unless @aliyun_zone_id
          raise ArgumentError, "Missing required arguments: #{missing_credentials.join(', ')}" unless missing_credentials.empty?

          @connection_options = options[:connection_options] || {}
          
          uri = URI.parse(@aliyun_url)
          @host   = uri.host
          @path   = uri.path
          @port   = uri.port
          @scheme = uri.scheme

          @persistent = options[:persistent] || false
          @connection = Fog::Core::Connection.new("#{@scheme}://#{@host}:#{@port}", @persistent, @connection_options)

        end

        def reload
          @connection.reset
        end

        def request(params)
          begin
            response = @connection.request(params.merge({
              :headers  => {
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-Auth-Token' => @auth_token
              }.merge!(params[:headers] || {}),
              :path     => "#{@path}/#{params[:path]}",
              :query    => params[:query]
            }))
          rescue Excon::Errors::HTTPStatusError => error
            raise case error
              when Excon::Errors::NotFound
                Fog::Compute::Aliyun::NotFound.slurp(error)
              else
                error
              end
          end

          if !response.body.empty? and response.get_header('Content-Type') == 'application/json'
            response.body = Fog::JSON.decode(response.body)
          end

          response
        end
        
        #operation compute-- default URL
        def defaultAliyunUri(action, sigNonce, time)
          parTimeFormat = time.strftime("%Y-%m-%dT%H:%M:%SZ")
          urlTimeFormat = URI.encode(parTimeFormat,':')
          return '?Format=JSON&AccessKeyId='+@aliyun_accesskey_id+'&Action='+action+'&SignatureMethod=HMAC-SHA1&RegionId='+@aliyun_region_id+'&SignatureNonce='+sigNonce+'&SignatureVersion=1.0&Version=2014-05-26&Timestamp='+urlTimeFormat
        end

        #generate random num
        def randonStr ()
          numStr = rand(100000).to_s
          timeStr = Time.now.to_f.to_s
          ranStr = timeStr+"-"+numStr
          return ranStr
        end

        #operation compute--collection of default parameters
        def defalutParameters(action, sigNonce, time)
          parTimeFormat = time.strftime("%Y-%m-%dT%H:%M:%SZ")
          para = {
            'Format'=>'JSON',
            'Version'=>'2014-05-26',
            'Action'=>action,
            'AccessKeyId'=>@aliyun_accesskey_id, 
            'SignatureVersion'=>'1.0',
            'SignatureMethod'=>'HMAC-SHA1',
            'SignatureNonce'=>sigNonce,
            'RegionId'=>@aliyun_region_id,
            'Timestamp'=>parTimeFormat};
          return para
        end

        #compute signature
        def sign (accessKeySecret,parameters)
          sortedParameters = parameters.sort
          canonicalizedQueryString = ''
          sortedParameters.each do | k, v |
              canonicalizedQueryString += '&' + URI.encode(k,'/[^!*\'()\;?:@#&%=+$,{}[]<>`" ') + '=' + URI.encode(v,'/[^!*\'()\;?:@#&%=+$,{}[]<>`" ')
          end

          canonicalizedQueryString[0] = ''
          stringToSign = 'GET&%2F&' + URI.encode(canonicalizedQueryString,'/[^!*\'()\;?:@#&%=+$,{}[]<>`" ')
          key = accessKeySecret + '&'

          digVer =  OpenSSL::Digest.new("sha1")
          digest =  OpenSSL::HMAC.digest(digVer, key, stringToSign)
          signature = Base64.encode64(digest)
          signature[-1] = ''
          encodedSig = URI.encode(signature,'/[^!*\'()\;?:@#&%=+$,{}[]<>`" ')

          return encodedSig
        end
      end
    end
  end
end
