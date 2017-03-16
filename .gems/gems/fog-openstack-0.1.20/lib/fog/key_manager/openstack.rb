module Fog
  module KeyManager
    class OpenStack < Fog::Service
      SUPPORTED_VERSIONS = /v1(\.0)*/

      requires :openstack_auth_url
      recognizes :openstack_auth_token, :openstack_management_url,
                 :persistent, :openstack_service_type, :openstack_service_name,
                 :openstack_tenant, :openstack_tenant_id, :openstack_userid,
                 :openstack_api_key, :openstack_username, :openstack_identity_endpoint,
                 :current_user, :current_tenant, :openstack_region,
                 :openstack_endpoint_type, :openstack_auth_omit_default_port,
                 :openstack_project_name, :openstack_project_id,
                 :openstack_project_domain, :openstack_user_domain, :openstack_domain_name,
                 :openstack_project_domain_id, :openstack_user_domain_id, :openstack_domain_id,
                 :openstack_identity_prefix, :openstack_temp_url_key, :openstack_cache_ttl


      ## MODELS
      #
      model_path 'fog/key_manager/openstack/models'
      model       :secret
      collection  :secrets
      model       :container
      collection  :containers

      ## REQUESTS

      # secrets
      request_path 'fog/key_manager/openstack/requests'
      request :create_secret
      request :list_secrets
      request :get_secret
      request :get_secret_payload
      request :get_secret_metadata
      request :delete_secret

      # containers
      request :create_container
      request :get_container
      request :list_containers
      request :delete_container

      class Real
        include Fog::OpenStack::Core

        def self.not_found_class
          Fog::KeyManager::OpenStack::NotFound
        end

        def initialize(options = {})
          initialize_identity options

          @openstack_service_type           = options[:openstack_service_type] || ['key-manager']
          @openstack_service_name           = options[:openstack_service_name]
          @connection_options               = options[:connection_options] || {}

          authenticate
          set_api_path

          @persistent = options[:persistent] || false
          @connection = Fog::Core::Connection.new("#{@scheme}://#{@host}:#{@port}", @persistent, @connection_options)
        end

        def set_api_path
          @path.sub!(%r{/$}, '')
          unless @path.match(SUPPORTED_VERSIONS)
            @path = supported_version(SUPPORTED_VERSIONS, @openstack_management_uri, @auth_token, @connection_options)
          end
        end

        def supported_version(supported_versions, uri, auth_token, connection_options = {})
          connection = Fog::Core::Connection.new("#{uri.scheme}://#{uri.host}:#{uri.port}", false, connection_options)
          response = connection.request({ :expects => [200, 204, 300],
                                          :headers => {'Content-Type' => 'application/json',
                                                       'Accept' => 'application/json',
                                                       'X-Auth-Token' => auth_token},
                                          :method => 'GET'
                                        })

          body = Fog::JSON.decode(response.body)
          version = nil

          versions =  body.fetch('versions',{}).fetch('values',[])
          versions.each do |v|
            if v.fetch('id', "").match(supported_versions) &&
              ['current', 'supported', 'stable'].include?(v.fetch('status','').downcase)
              version = v['id']
            end
          end

          if !version  || version.empty?
            raise Fog::OpenStack::Errors::ServiceUnavailable.new(
                    "OpenStack service only supports API versions #{supported_versions.inspect}")
          end

          version
        end

      end
    end
  end
end
