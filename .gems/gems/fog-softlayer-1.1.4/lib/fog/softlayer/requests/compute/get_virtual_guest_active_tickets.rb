#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#
module Fog
  module Compute
    class Softlayer
      class Mock
        # Gets all Virtual Guest active tickets
        # @param [Integer] id
        # @return [Excon::Response]
        def get_virtual_guest_active_tickets(id)
          response = Excon::Response.new
          found = self.get_vms.body.map{|server| server['id']}.include?(id)
          unless found
            response.status = 404
            response.body = {
              "error" => "Unable to find object with id of '#{id}'.",
              "code" => "SoftLayer_Exception_ObjectNotFound"
            }
          else
            response.status = 200
            response.body = get_active_tickets
          end
          response
        end
      end

      class Real
        def get_virtual_guest_active_tickets(id)
          request(:virtual_guest, "#{id.to_s}/getActiveTickets", :http_method => :GET)
        end
      end
    end
  end
end

module Fog
  module Compute
    class Softlayer
      class Mock
        def get_active_tickets
          [
            {
              "accountId"=>1,
              "assignedUserId"=>1,
              "billableFlag"=>nil,
              "changeOwnerFlag"=>false,
              "createDate"=>"2015-03-17T07:42:42-05:00",
              "groupId"=>1,
              "id"=>1,
              "lastEditDate"=>"2015-03-17T07:42:43-05:00",
              "lastEditType"=>"AUTO",
              "locationId"=>nil,
              "modifyDate"=>"2015-03-17T07:42:43-05:00",
              "notifyUserOnUpdateFlag"=>true,
              "originatingIpAddress"=>"10.10.10.10",
              "priority"=>0,
              "responsibleBrandId"=>1,
              "serverAdministrationBillingAmount"=>nil,
              "serverAdministrationBillingInvoiceId"=>nil,
              "serverAdministrationFlag"=>0,
              "serverAdministrationRefundInvoiceId"=>nil,
              "serviceProviderId"=>1,
              "serviceProviderResourceId"=>1,
              "statusId"=>1,
              "subjectId"=>1,
              "title"=>"API Question - Testing API",
              "totalUpdateCount"=>1,
              "userEditableFlag"=>true
            }
          ]
        end
      end
    end
  end
end
