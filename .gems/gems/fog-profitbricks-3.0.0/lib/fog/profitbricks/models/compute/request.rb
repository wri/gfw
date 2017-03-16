module Fog
  module Compute
    class ProfitBricks
      class Request < Fog::Models::ProfitBricks::Base
        identity  :id

        # properties
        attribute :method
        attribute :headers
        attribute :body
        attribute :url

        # metadata
        attribute :created_date,   :aliases => 'createdDate', :type => :time
        attribute :created_by, 	   :aliases => 'createdBy'
        attribute :request_status, :aliases => 'requestStatus'
        attribute :status
        attribute :message
        attribute :targets
      end
    end
  end
end
