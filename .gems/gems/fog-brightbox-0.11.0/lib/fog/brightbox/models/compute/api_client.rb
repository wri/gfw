module Fog
  module Compute
    class Brightbox
      class ApiClient < Fog::Brightbox::Model
        identity :id
        attribute :name
        attribute :description
        attribute :secret
        attribute :revoked_at, :type => :time
        attribute :permissions_group
        attribute :account_id

        def save
          raise Fog::Errors::Error.new("Resaving an existing object may create a duplicate") if persisted?
          options = {
            :name => name,
            :description => description,
            :permissions_group => permissions_group
          }.delete_if { |_k, v| v.nil? || v == "" }
          data = service.create_api_client(options)
          merge_attributes(data)
          true
        end

        def destroy
          requires :identity
          service.destroy_api_client(identity)
          true
        end

        def reset_secret
          requires :identity
          service.reset_secret_api_client(identity)
          true
        end
      end
    end
  end
end
