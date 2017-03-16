require File.expand_path('../ip_block', __FILE__)
require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class IpBlocks < Fog::Collection
        include Fog::Helpers::ProfitBricks::DataHelper
        model Fog::Compute::ProfitBricks::IpBlock

        def all
          result = service.get_all_ip_blocks

          load(result.body['items'].each { |ip_block| flatten(ip_block) })
        end

        def get(ip_block_id)
          ip_block = service.get_ip_block(ip_block_id).body

          new(flatten(ip_block))
        end
      end
    end
  end
end
