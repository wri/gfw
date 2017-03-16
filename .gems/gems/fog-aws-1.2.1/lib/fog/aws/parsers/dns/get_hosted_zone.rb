module Fog
  module Parsers
    module DNS
      module AWS
        class GetHostedZone < Fog::Parsers::Base
          def reset
            @hosted_zone = {}
            @name_servers = []
            @response = {}
            @section = :hosted_zone
            @vpcs = []
            @vpc = {}
          end

          def end_element(name)
            if @section == :hosted_zone
              case name
              when 'Id'
                @hosted_zone[name]= value.sub('/hostedzone/', '')
              when 'Name', 'CallerReference', 'Comment', 'PrivateZone', 'Config', 'ResourceRecordSetCount'
                @hosted_zone[name]= value
              when 'HostedZone'
                @response['HostedZone'] = @hosted_zone
                @hosted_zone = {}
                @section = :name_servers
              when 'ResourceRecordSetCount'
                @response['ResourceRecordSetCount'] = value.to_i
              end
            elsif @section == :name_servers
              case name
              when 'NameServer'
                @name_servers << value
              when 'NameServers'
                @response['NameServers'] = @name_servers
                @name_servers = {}
              when 'VPCId', 'VPCRegion'
                @vpc[name] = value
              when 'VPC'
                @vpcs << @vpc
                @vpc = {}
              when 'VPCs'
                @response['HostedZone']['VPCs'] = @vpcs
                @vpcs = {}
                @section = :vpcs
              end
            end
          end
        end
      end
    end
  end
end
