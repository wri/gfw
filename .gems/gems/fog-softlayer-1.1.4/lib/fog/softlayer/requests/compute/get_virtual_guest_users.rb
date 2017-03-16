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
        # Gets all Virtual Guest users
        # @param [Integer] id
        # @return [Excon::Response]
        def get_virtual_guest_users(id)
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
            response.body = get_users
          end
          response
        end
      end

      class Real
        def get_virtual_guest_users(id)
          request(:virtual_guest, "#{id}/getUsers")
        end
      end
    end
  end
end

module Fog
  module Compute
    class Softlayer
      class Mock
        def get_users
          [
            {
              "accountId"=>000000, 
          	  "address1"=>"Your address", 
          	  "authenticationToken"=>
          	  {
          	    "hash"=>"06e849qqq25e5266753043484893344232", 
          	    "user"=>nil, 
          	    "userId"=>000000
          	  }, 
          	  "city"=>"Your City", 
          	  "companyName"=>"Your Company", 
          	  "country"=>"Your country", 
          	  "createDate"=>"2014-03-05T13:23:04-06:00", 
          	  "daylightSavingsTimeFlag"=>true, 
          	  "denyAllResourceAccessOnCreateFlag"=>false, 
          	  "displayName"=>"Your name", 
          	  "email"=>"youremail@example.com", 
          	   "firstName"=>"Your name", 
          	  "forumPasswordHash"=>"121kdsksdkvm323j4j3", 
          	  "id"=>000000, 
          	  "lastName"=>"Your last name", 
          	  "localeId"=>1, 
          	  "modifyDate"=>"2014-03-05T13:23:04-06:00", 
          	  "officePhone"=>"+55 00 111-111", 
          	  "parentId"=>nil, 
          	  "passwordExpireDate"=>nil, 
          	  "permissionSystemVersion"=>2, 
          	  "postalCode"=>"000000-000", 
          	  "pptpVpnAllowedFlag"=>false, 
          	  "savedId"=>"000000", 
          	  "secondaryLoginManagementFlag"=>nil, 
          	  "secondaryLoginRequiredFlag"=>nil, 
          	  "secondaryPasswordModifyDate"=>"2014-03-05T13:40:12-06:00", 
          	  "secondaryPasswordTimeoutDays"=>nil, 
          	  "sslVpnAllowedFlag"=>false, 
          	  "state"=>"OT", 
          	  "statusDate"=>"2014-03-05T13:23:04-06:00", 
          	  "timezoneId"=>114, 
          	  "userStatusId"=>1001, 
          	  "username"=>"Your username", 
          	  "vpnManualConfig"=>false, 
          	  "account"=>
          	  {
          	    "accountManagedResourcesFlag"=>false, 
          	    "accountStatusId"=>1001, 
          	    "address1"=>"Your address 1", 
          	    "address2"=>"Your address 2", 
          	    "allowedPptpVpnQuantity"=>1, 
          	    "brandId"=>2, 
          	    "city"=>"Your city", 
          	    "claimedTaxExemptTxFlag"=>false, 
          	    "companyName"=>"Your company", 
          	    "country"=>"Your country", 
          	    "createDate"=>"2014-03-05T13:23:04-06:00", 
          	    "email"=>"youremail@example.com", 
          	    "firstName"=>"Your name", 
          	    "id"=>000000, 
          	    "isReseller"=>1, 
          	    "lastName"=>"Your last name", 
          	    "lateFeeProtectionFlag"=>nil, 
          	    "modifyDate"=>"2014-04-29T15:22:55-05:00", 
          	    "officePhone"=>"+00 00 0000-0000", 
          	    "postalCode"=>"00000-000", 
          	    "state"=>"OT", 
          	    "statusDate"=>nil, 
          	    "masterUser"=>nil
          	  }, 
          	  "apiAuthenticationKeys"=>
          	  [
          	    {
          	      "authenticationKey"=>"43k43dsmkf9994m3mdkm3k2mcdsk32", 
          		    "id"=>000000, 
          		    "timestampKey"=>302399304309, 
          		    "userId"=>000000
          	    }
          	  ], 
          	  "locale"=>
          	  {
          	    "friendlyName"=>"English", 
          	    "id"=>1, 
          	    "languageTag"=>"en-US", 
          	    "name"=>"English"
          	  }, 
          	  "timezone"=>
          	  {
          	    "id"=>114, 
          	    "longName"=>"(GMT-06:00) America/Dallas - CST", "name"=>"America/Chicago", 
          	    "offset"=>"-0600", 
          	    "shortName"=>"CST"
          	  }, 
          	  "userStatus"=>
            	{
          	    "id"=>1001, 
          	    "keyName"=>"ACTIVE", 
          	    "name"=>"Active"
          	  }
            }
          ]
        end
      end
    end
  end
end
