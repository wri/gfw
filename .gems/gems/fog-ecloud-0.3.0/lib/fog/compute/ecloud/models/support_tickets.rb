require File.expand_path("../support_ticket", __FILE__)

module Fog
  module Compute
    class Ecloud
      class SupportTickets < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::SupportTicket

        def all
          data = service.get_support_tickets(href).body[:TicketReference]
          load(data)
        end

        def get(uri)
          if data = service.get_support_ticket(uri)
            new(data.body)
          end
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end
      end
    end
  end
end
