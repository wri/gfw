require File.expand_path('../firewall_rule', __FILE__)
require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class FirewallRules < Fog::Collection
        include Fog::Helpers::ProfitBricks::DataHelper
        model Fog::Compute::ProfitBricks::FirewallRule

        def all(datacenter_id, server_id, nic_id)
          result = service.get_all_firewall_rules(datacenter_id, server_id, nic_id)

          firewall_rules = result.body['items'].each do |fwr|
            fwr['datacenter_id'] = datacenter_id
            fwr['server_id']      = server_id
            fwr['nic_id']         = nic_id
          end

          result.body['items'] = firewall_rules

          load(result.body['items'].each { |fwr| flatten(fwr) })
        end

        def get(datacenter_id, server_id, nic_id, firewall_rule_id)
          firewall_rule = service.get_firewall_rule(datacenter_id, server_id, nic_id, firewall_rule_id).body

          firewall_rule['datacenter_id'] = datacenter_id
          firewall_rule['server_id']      = server_id
          firewall_rule['nic_id']         = nic_id

          new(flatten(firewall_rule))
        end
      end
    end
  end
end
