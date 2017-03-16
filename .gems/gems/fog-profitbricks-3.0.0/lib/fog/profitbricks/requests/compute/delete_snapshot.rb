module Fog
  module Compute
    class ProfitBricks
      class Real
        # Delete virtual data center
        #
        # ==== Parameters
        # * snapshot_id<~String> - UUID of the snapshot
        #
        # ==== Returns
        # * response<~Excon::Response>
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#delete-snapshot]
        def delete_snapshot(snapshot_id)
          request(
            :expects => [202],
            :method  => 'DELETE',
            :path    => "/snapshots/#{snapshot_id}"
          )
        end
      end

      class Mock
        def delete_snapshot(snapshot_id)
          response = Excon::Response.new
          response.status = 202

          if snapshot = data[:snapshots]['items'].find do |attrib|
            attrib['id'] == snapshot_id
          end
          else
            raise Fog::Errors::NotFound, 'The requested resource could not be found'
          end

          response
        end
      end
    end
  end
end
