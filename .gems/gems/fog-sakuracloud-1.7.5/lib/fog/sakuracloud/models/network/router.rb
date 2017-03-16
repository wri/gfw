require 'fog/core/model'

module Fog
  module Network
    class SakuraCloud
      class Router < Fog::Model
        identity :id, :aliases => 'ID'
        attribute :name, :aliases => 'Name'
        attribute :description, :aliases => 'Description'
        attribute :networkmasklen, :aliases => 'NetworkMaskLen'
        attribute :bandwidthmbps, :aliases => 'BandWidthMbps'
        attribute :switch, :aliases => 'Switch'


        def delete
          service.delete_router(identity)
          true
        end
        alias_method :destroy, :delete

        def save
          requires :name, :networkmasklen
          Fog::Logger.warning("Create Router with public subnet")
          attached_switch = service.create_router(@attributes).body["Internet"]
          Fog::Logger.warning("Waiting available new router...")
          new_data = switch_available?(service, attached_switch["ID"])
          id = new_data['internet']['ID']
          merge_attributes(new_data['internet'])
          self.reload
          true
        end

        def collect_monitor(start_time = nil, end_time = nil)
          service.collect_monitor_router(identity, start_time, end_time).body["Data"]
        end

        def change_bandwidth(bandwidth)
          ## change_bandwidth returns router as new one.
          new_router = service.change_router_bandwidth(identity, bandwidth).body["Internet"]
          self.id = new_router['ID']
          self.reload
        end

        def switch_available?(network, router_id)
          until network.switches.find {|r| r.internet != nil && r.internet["ID"] == router_id}
            print '.'
            sleep 2
          end
          ::JSON.parse((network.switches.find {|r| r.internet != nil && r.internet["ID"] == router_id}).to_json)
        end
      end
    end
  end
end
