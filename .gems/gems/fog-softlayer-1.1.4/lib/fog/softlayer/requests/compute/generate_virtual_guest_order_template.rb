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
        # Generate an order template for a Virtual Guest
        # @param [Integer] order_template
        # @return [Excon::Response]
        def generate_virtual_guest_order_template(order_template)
          raise ArgumentError, "Fog::Compute::Softlayer#create_vms expects argument of type Hash" unless order_template.kind_of?(Hash)
          response = Excon::Response.new
          required = %w{hostname domain startCpus maxMemory hourlyBillingFlag localDiskFlag}
          begin
            raise MissingRequiredParameter unless Fog::Softlayer.valid_request?(required, order_template)
            response.status = 200
            response.body = order_template_mock
          rescue MissingRequiredParameter
            response.status = 500
            response.body = {
              "code" => "SoftLayer_Exception_MissingCreationProperty",
              "error" => "Properties #{required.join(', ')} ALL must be set to create an instance of 'SoftLayer_Virtual_Guest'."
            }
          end
          @virtual_guests.push(response.body).flatten!
          response
        end
      end

      class Real
        def generate_virtual_guest_order_template(order_template)
          request(:virtual_guest, :generate_order_template, body: order_template, :http_method => :POST)
        end
      end
    end
  end
end

module Fog
  module Compute
    class Softlayer
      class Mock
        def order_template_mock
          {
            "imageTemplateId"=>nil,
            "location"=>"265592",
            "packageId"=>46,
            "prices"=>[
              {
                "hourlyRecurringFee"=>".021",
                "id"=>1640,
                "recurringFee"=>"15",
                "item"=>{
                  "description"=>"1 x 2.0 GHz Core"
                }
              },
              {
                "hourlyRecurringFee"=>".019",
                "id"=>1644,
                "recurringFee"=>"12.6",
                "item"=>{
                  "description"=>"1 GB"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>37202,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"Ubuntu Linux 14.04 LTS Trusty Tahr - Minimal Install (64 bit)"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>13899,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"25 GB (LOCAL)"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>55,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"Host Ping"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>57,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"Email and Ticket"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>58,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"Automated Notification"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>272,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"10 Mbps Public & Private Network Uplinks"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>1800,
                "item"=>{
                  "description"=>"0 GB Bandwidth"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>420,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"Unlimited SSL VPN Users & 1 PPTP VPN User per account"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>418,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"Nessus Vulnerability Assessment & Reporting"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>905,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"Reboot / Remote Console"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>21,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"1 IP Address"
                }
              }
            ],
            "quantity"=>1,
            "sourceVirtualGuestId"=>nil,
            "sshKeys"=>[],
            "useHourlyPricing"=>true,
            "virtualGuests"=>[
              {
                "domain"=>"example.com",
                "hostname"=>"host1"
              }
            ],
            "complexType"=>"SoftLayer_Container_Product_Order_Virtual_Guest"
          }
        end
      end
    end
  end
end