#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

require 'fog/compute/models/server'

module Fog
  module Compute
    class Softlayer

      class Server < Fog::Compute::Server

        identity  :id,                       :type => :integer
        attribute :name,                     :aliases => 'hostname'
        attribute :domain
        attribute :fqdn,                     :aliases => 'fullyQualifiedDomainName'
        attribute :cpu,                      :aliases => ['startCpus', 'processorCoreAmount']
        attribute :ram,                      :aliases => ['maxMemory', 'memory']
        attribute :disk,                     :aliases => ['blockDevices','hardDrives']
        attribute :private_ip_address,       :aliases => 'primaryBackendIpAddress'
        attribute :public_ip_address,        :aliases => 'primaryIpAddress'
        attribute :flavor_id
        attribute :bare_metal,               :type => :boolean
        attribute :os_code
        attribute :image_id
        attribute :ephemeral_storage,        :aliases => 'localDiskFlag'
        attribute :key_pairs,                :aliases => 'sshKeys'
        attribute :network_components
        attribute :fixed_configuration_preset, :aliases => 'fixedConfigurationPreset'

        # Times
        attribute :created_at,              :aliases => ['createDate', 'provisionDate'], :type => :time
        attribute :last_verified_date,      :aliases => 'lastVerifiedDate', :type => :time
        attribute :metric_poll_date,        :aliases => 'metricPollDate', :type => :time
        attribute :modify_date,             :aliases => 'modifyDate', :type => :time

        # Metadata
        attribute :account_id,              :aliases => 'accountId', :type => :integer
        attribute :datacenter,              :aliases => 'datacenter'
        attribute :single_tenant,           :aliases => 'dedicatedAccountHostOnlyFlag'
        attribute :global_identifier,       :aliases => 'globalIdentifier'
        attribute :hourly_billing_flag,     :aliases => 'hourlyBillingFlag'
        attribute :tags,                    :aliases => 'tagReferences'
        attribute :private_network_only,    :aliases => 'privateNetworkOnlyFlag'
        attribute :user_data,               :aliases => 'userData'
        attribute :uid,                     :aliases => 'globalIdentifier'
        attribute :provision_script,        :aliases => 'postInstallScriptUri'

        def initialize(attributes = {})
          # Forces every request inject bare_metal parameter
          raise Exception if attributes[:collection].nil? and attributes['bare_metal'].nil?
          super(attributes)
          set_defaults
        end

        def add_tags(tags)
          requires :id
          raise ArgumentError, "Tags argument for #{self.class.name}##{__method__} must be Array." unless tags.is_a?(Array)
          tags.each do |tag|
            service.tags.new(:resource_id => self.id, :name => tag).save
          end
          self.reload
          true
        end

        def bare_metal?
          bare_metal
        end

        def bare_metal
          @bare_metal
        end

        def datacenter=(name)
          name = name['name'] if name.is_a?(Hash)
          attributes[:datacenter] = { :name => name }
        end

        def datacenter
          attributes[:datacenter][:name] unless attributes[:datacenter].nil?
        end

        def delete_tags(tags)
          requires :id
          raise ArgumentError, "Tags argument for #{self.class.name}##{__method__} must be Array." unless tags.is_a?(Array)
          tags.each do |tag|
            service.tags.new(:resource_id => self.id, :name => tag).destroy
          end
          self.reload
          true
        end

        def destroy
          requires :id
          request = bare_metal? ? :delete_bare_metal_server : :delete_vm
          response = service.send(request, self.id)
          response.body
        end

        def dns_name
          fqdn
        end

        def image_id=(uuid)
          attributes[:image_id] = {:globalIdentifier => uuid}
        end

        def image_id
          attributes[:image_id][:globalIdentifier] unless attributes[:image_id].nil?
        end

        def name=(set)
          attributes[:hostname] = set
        end

        def name
          attributes[:hostname]
        end

        def pre_save
          extract_flavor
          self.bare_metal = true if attributes[:fixed_configuration_preset] and not bare_metal?
          validate_attributes
          if self.vlan
            attributes[:vlan] = { :networkVlan => { :id => self.vlan.id } }
          end
          if self.private_vlan
            attributes[:private_vlan] = { :networkVlan => { :id => self.private_vlan.id } }
          end
          if self.key_pairs
            attributes[:key_pairs].map! { |key| { :id => key.respond_to?(:id) ? key.id : key } }
          end
          if self.network_components
            self.network_components = self.network_components.map do |component|
              component['maxSpeed'] = component.delete('speed') if component['speed']
              component['maxSpeed'] = component.delete('max_speed') if component['max_speed']
              component
            end
          end

          if attributes[:fixed_configuration_preset].is_a? String
              attributes[:fixedConfigurationPreset] = {:keyName => attributes.delete(:fixed_configuration_preset)}
          end

          remap_attributes(attributes, attributes_mapping)
          clean_attributes
        end

        def private_ip # maintain backward compatibility with <0.3.13
          private_ip_address
        end

        def public_ip # maintain backward compatibility with <0.3.13
          public_ip_address
        end

        def os_code
          attributes['operatingSystem']['softwareLicense']['softwareDescription']['referenceCode'] if attributes['operatingSystem']
        end

        def private_vlan
          attributes[:private_vlan] ||= _get_private_vlan
        end

        def private_vlan=(value)
          unless value.is_a?(Integer) or value.is_a?(Fog::Network::Softlayer::Network)
            raise ArgumentError, "vlan argument for #{self.class.name}##{__method__} must be Integer or Fog::Network::Softlayer::Network."
          end
          value = network_connection.networks.get(value) if value.is_a?(Integer)
          attributes[:private_vlan] = value
        end

        # reload the OS on a server (method name reload was already taken)
        def relaunch!
          requires :id
          body = [ "FORCE", {}]
          body[1][:sshKeyIds] = key_pairs.map {|kp| kp.id} unless key_pairs.empty?
          type = bare_metal? ? :hardware_server : :virtual_guest
          status = service.request(type, "#{id}/reloadOperatingSystem", :body => body, :http_method => :post).status
          wait_for { not ready? } # block until the relaunch has begun
          [200, 201].include?(status)
        end

        def key_pairs
          attributes[:key_pairs]
        end

        def key_pairs=(keys)
          raise ArgumentError, "Argument #{local_variables.first.to_s} for #{self.class.name}##{__method__} must be Array." unless keys.is_a?(Array)
          attributes[:key_pairs] = []
          keys.map do |key|
            ## This was nice but causing an intolerable number of requests on an account with lots of keys.
            ## ToDo: something better...
            #key = self.symbolize_keys(key) if key.is_a?(Hash)
            #unless key.is_a?(Fog::Compute::Softlayer::KeyPair) or (key.is_a?(Hash) and key[:id])
            #  raise ArgumentError, "Elements of keys array for #{self.class.name}##{__method__} must be a Hash with key 'id', or Fog::Compute::Softlayer::KeyPair"
            #end
            #key = service.key_pairs.get(key[:id]) unless key.is_a?(Fog::Compute::Softlayer::KeyPair)
            attributes[:key_pairs] << key
          end
        end

        def vlan
          attributes[:vlan] ||= _get_vlan
        end

        def vlan=(value)
          unless value.is_a?(Integer) or value.is_a?(Fog::Network::Softlayer::Network)
            raise ArgumentError, "vlan argument for #{self.class.name}##{__method__} must be Integer or Fog::Network::Softlayer::Network."
          end
          value = network_connection.networks.get(value) if value.is_a?(Integer)
          attributes[:vlan] = value
        end

        def ram=(set)
          if set.is_a?(Array) and set.first['hardwareComponentModel']
            set = 1024 * set.first['hardwareComponentModel']['capacity'].to_i
          end
          attributes[:ram] = set
        end

        # @params value [String]
        def user_data=(value)
          attributes[:user_data] = [{'value' => value}]
        end

        def user_data
          attributes[:user_data]
        end

        def provision_script=(value)
          attributes[:provision_script] = value
        end

        def provision_script
          attributes[:provision_script]
        end

        def network_components
          if id
            (public_network_components << private_network_components).flatten
          else
            attributes[:network_components]
          end
        end

        def public_network_components
          if attributes['frontendNetworkComponents']
            attributes['frontendNetworkComponents'].map { |n| Fog::Compute::Softlayer::NetworkComponent.new(n) }
          else
            []
          end
        end

        def private_network_components
          if attributes['backendNetworkComponents']
            attributes['backendNetworkComponents'].map { |n| Fog::Compute::Softlayer::NetworkComponent.new(n) }
          else
            []
          end
        end

        def active_transaction
          if bare_metal?
            service.request(:hardware_server, "#{id}/getActiveTransaction").body
          else
            service.request(:virtual_guest, "#{id}/getActiveTransaction").body
          end
        end

        def ready?
          begin
            if active_transaction
              false
            elsif bare_metal?
              state == "on"
            else
              state == "Running"
            end
          rescue Excon::Errors::InternalServerError => e
            false
          end
        end

        def reboot(use_hard_reboot = true)
          # requires :id # TODO: debug why this breaks the tests on bare metal and uncomment this
          if bare_metal?
            service.reboot_bare_metal_server(id, use_hard_reboot)
          else
            service.reboot_vm(id, use_hard_reboot)
          end
          true
        end

        def ssh_password
          requires :id
          service_path = bare_metal? ? :hardware_server : :virtual_guest
          @sshpass ||= service.request(service_path, id, :query => 'objectMask=mask[id,operatingSystem.passwords[password]]').body
          @sshpass['operatingSystem']['passwords'][0]['password'] unless @sshpass['operatingSystem'].nil? or @sshpass['operatingSystem']['passwords'].empty?
        end

        def snapshot
          # TODO: implement
        end

        def start
          # requires :id # TODO: debug why this breaks the tests on bare metal and uncomment this
          if bare_metal?
            service.power_on_bare_metal_server(id)
          else
            service.power_on_vm(id)
          end
          true
        end

        # Hard power off
        def stop
          # requires :id # TODO: debug why this breaks the tests on bare metal and uncomment this
          if bare_metal?
            service.power_off_bare_metal_server(id)
          else
            service.power_off_vm(id, true)
          end
          true
        end

        # Soft power off
        def shutdown
          # requires :id # TODO: debug why this breaks the tests on bare metal and uncomment this
          if bare_metal?
            raise Fog::Errors::Error.new('Shutdown not supported on baremetal servers. Use #stop.')
          else
            service.power_off_vm(id, false)
          end
          true
        end

        def state
          if bare_metal?
            service.request(:hardware_server, "#{id}/getServerPowerState").body
          else
            service.request(:virtual_guest, "#{id}/getPowerState").body['name']
          end
        end

        # Creates server
        # * requires attributes: :name, :domain, and :flavor_id OR (:cpu_count && :ram && :disks)
        #
        # @note You should use servers.create to create servers instead calling this method directly
        #
        # * State Transitions
        #   * BUILD -> ACTIVE
        #   * BUILD -> ERROR (on error)
        def save
          raise Fog::Errors::Error.new('Resaving an existing object may create a duplicate') if persisted?
          copy = self.dup
          copy.pre_save

          data = if copy.bare_metal?
            service.create_bare_metal_server(copy.attributes).body
          else
            service.create_vm(copy.attributes).body.first
          end

          data.delete("bare_metal")
          merge_attributes(data)
          true
        end

        def tags
          attributes[:tags].map { |i| i['tag']['name'] if i['tag'] }.compact if attributes[:tags]
        end

        def get_active_tickets
          return service.get_bare_metal_active_tickets(id).body if bare_metal?
          service.get_virtual_guest_active_tickets(id).body
        end

        def get_users
          return service.get_bare_metal_users(id).body if bare_metal?
          service.get_virtual_guest_users(id).body
        end

        def get_upgrade_options
          return service.get_bare_metal_upgrade_item_prices(id).body if bare_metal?
          service.get_virtual_guest_upgrade_item_prices(id).body
        end

        def update(update_attributes)
          raise ArgumentError if update_attributes.nil?
          product_connection
          prices = get_item_prices_id(update_attributes)
          order = generate_upgrade_order(prices, update_attributes[:time] || update_attributes[:maintenance_window])
          @product_conn.place_order(order).body
        end

        def generate_order_template
          copy = self.dup
          copy.pre_save
          return service.generate_bare_metal_order_template(copy.attributes).body if copy.bare_metal?
          service.generate_virtual_guest_order_template(copy.attributes).body
        end

        def wait_for_id(timeout=14400, delay=30)
          # Cannot use self.wait_for because it calls reload which requires
          # self.id which is not initially available for bare metal.
          filterStr = Fog::JSON.encode({
            "hardware" => {
              "hostname" => {
                "operation" => self.name,
              },
              "domain" => {
                "operation" => self.domain,
              },
              "globalIdentifier" => {
                "operation" => self.uid,
              },
            }
          })

          Fog.wait_for(timeout, delay) do
            res = service.request(:account, 'getHardware', :query => {
              :objectMask => 'mask[id,fullyQualifiedDomainName,provisionDate,hardwareStatus,lastTransaction[elapsedSeconds,transactionStatus[friendlyName]],operatingSystem[id,passwords[password,username]]]',
              :objectFilter => filterStr,
            })

            server = res.body.first

            yield server if block_given?

            if server and server["provisionDate"]
                attributes[:id] = server['id']
                true
            else
                false
            end
          end

          self.reload
          true
        end

        private

        def network_connection
          @network_conn ||= Fog::Network.new(
              :provider => :softlayer,
              :softlayer_username => service.instance_variable_get(:@softlayer_username),
              :softlayer_api_key =>  service.instance_variable_get(:@softlayer_api_key)
          )
        end

        def product_connection
          if Fog.mock?
            @product_conn = Fog::Softlayer::Product.new(
                :provider => :softlayer,
                :softlayer_username => service.instance_variable_get(:@credentials)[:username],
                :softlayer_api_key => service.instance_variable_get(:@credentials)[:api_key]
            )
          end
          @product_conn ||= Fog::Softlayer::Product.new(
              :provider => :softlayer,
              :softlayer_username => service.instance_variable_get(:@softlayer_username),
              :softlayer_api_key =>  service.instance_variable_get(:@softlayer_api_key)
          )
        end

        def _get_private_vlan
          if self.id
            vlan_id = if bare_metal?
              service.request(:hardware_server, "#{self.id}/get_private_vlan").body['id']
            else
              service.request(:virtual_guest, self.id, :query => 'objectMask=primaryBackendNetworkComponent.networkVlan').body['primaryBackendNetworkComponent']['networkVlan']['id']
            end
            network_connection.networks.get(vlan_id)
          end
        end

        def _get_vlan
          if self.id
            vlan_id = if bare_metal?
              service.request(:hardware_server, "#{self.id}/get_public_vlan").body['id']
            else
              service.request(:virtual_guest, self.id, :query => 'objectMask=primaryNetworkComponent.networkVlan').body['primaryNetworkComponent']['networkVlan']['id']
            end
            network_connection.networks.get(vlan_id)
          end
        end

        ##
        # Generate mapping for use with remap_attributes
        def attributes_mapping
          common = {
              :hourly_billing_flag => :hourlyBillingFlag,
              :os_code  =>  :operatingSystemReferenceCode,
              :vlan => :primaryNetworkComponent,
              :private_vlan => :primaryBackendNetworkComponent,
              :key_pairs => :sshKeys,
              :private_network_only => :privateNetworkOnlyFlag,
              :user_data => :userData,
              :provision_script => :postInstallScriptUri,
              :network_components => :networkComponents,
          }

          conditional = if bare_metal?
            {
              :cpu  =>   :processorCoreAmount,
              :ram  =>   :memoryCapacity,
              :disk =>   :hardDrives,
              :bare_metal => :bareMetalInstanceFlag,
              :fixed_configuration_preset => :fixedConfigurationPreset,
            }
          else
            {
              :cpu  =>   :startCpus,
              :ram  =>   :maxMemory,
              :disk =>   :blockDevices,
              :image_id =>  :blockDeviceTemplateGroup,
              :ephemeral_storage => :localDiskFlag,
            }
          end
          common.merge(conditional)
        end

        def bare_metal=(set)
          return @bare_metal if set == @bare_metal
          raise Exception, "Bare metal flag has already been set" unless @bare_metal.nil?
          @bare_metal = case set
            when false, 'false', 0, nil, ''
              attributes[:bare_metal] = false
            else
              attributes[:bare_metal] = true
          end
        end

        ##
        # Remove model attributes that aren't expected by the SoftLayer API
        def clean_attributes
          attributes.delete(:bare_metal)
          attributes.delete(:flavor_id)
          attributes.delete(:ephemeral_storage)
          attributes.delete(:tags) if bare_metal?
        end

        ##
        # Expand a "flavor" into cpu, ram, and disk attributes
        def extract_flavor
          if attributes[:flavor_id]
            flavor = @service.flavors.get(attributes[:flavor_id])
            flavor.nil? and Fog::Errors::Error.new("Unrecognized flavor in #{self.class}##{__method__}")
            attributes[:cpu] = flavor.cpu
            attributes[:ram] = flavor.ram
            attributes[:disk] = flavor.disk unless attributes[:image_id]
            if bare_metal?
              value = flavor.disk.first['diskImage']['capacity'] < 500 ? 250 : 500
              attributes[:disk] = [{'capacity'=>value}]
              attributes[:ram] = attributes[:ram] / 1024 if attributes[:ram] > 64
            end
          end
        end

        def validate_attributes
          requires :name, :domain, :datacenter
          if attributes[:fixed_configuration_preset]
              requires :os_code
          else
              requires :cpu, :ram
              requires_one :os_code, :image_id
              requires_one :disk, :image_id
          end
          bare_metal? and image_id and raise ArgumentError, "Bare Metal Cloud does not support booting from Image"
        end

        def set_defaults
          attributes[:hourly_billing_flag] = true if attributes[:hourly_billing_flag].nil?
          attributes[:ephemeral_storage] = false if attributes[:ephemeral_storage].nil?
          attributes[:domain] = service.softlayer_default_domain if service.softlayer_default_domain and attributes[:domain].nil?
          self.datacenter = service.softlayer_default_datacenter if service.softlayer_default_datacenter and attributes[:datacenter].nil?
        end

        def get_item_prices_id_by_value(item_price_array, category, value)
          item_prices = item_price_array.select { |item_price| item_price["categories"].find { |category_hash| category_hash["categoryCode"] == category } }
          item_price = item_prices.find { |item_price| item_price['item']['capacity'] == value.to_s }
          item_price.nil? ? "" : item_price["id"]
        end

        def get_item_prices_id(update_attributes)
          item_price_array = get_upgrade_options
          update_attributes.delete(:time)
          update_attributes.delete(:maintenance_window)
          update_attributes.map { |key, value| { :id => get_item_prices_id_by_value(item_price_array, key.to_s, value) } }
        end

        def bm_upgrade_order_template(value)
          {
            :complexType => 'SoftLayer_Container_Product_Order_Hardware_Server_Upgrade',
            :hardware => [
              {
                :id => id
              }
            ],
            :properties => [
              {
                :name => 'MAINTENANCE_WINDOW_ID',
                :value => value
              }
            ]
          }
        end

        def vm_upgrade_order_template(time)
          {
            :complexType => 'SoftLayer_Container_Product_Order_Virtual_Guest_Upgrade',
            :virtualGuests => [
              {
                :id => id
              }
            ],
            :properties => [
              {
                :name => 'MAINTENANCE_WINDOW',
                :value => (time.nil? || time.empty?) ? Time.now.iso8601 : time.iso8601
              }
            ]
          }
        end

        def generate_upgrade_order(prices, value)
          return bm_upgrade_order_template(value).merge({ :prices => prices }) if bare_metal?
          vm_upgrade_order_template(value).merge({ :prices => prices })
        end
      end
    end
  end
end
