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
        # Generate an order template for a Bare Metal
        # @param [Integer] order_template
        # @return [Excon::Response]
        def generate_bare_metal_order_template(order_template)
          raise ArgumentError, "Fog::Compute::Softlayer#create_vms expects argument of type Hash" unless order_template.kind_of?(Hash)
          response = Excon::Response.new
          required = %w{hostname domain processorCoreAmount memoryCapacity hourlyBillingFlag operatingSystemReferenceCode}
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
        def generate_bare_metal_order_template(order_template)
          request(:hardware_server, :generate_order_template, body: order_template, :http_method => :POST)
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
            "hardware"=>[
              {
                "domain"=>"example.com",
                "hostname"=>"host1"
              }
            ],
            "location"=>"265592",
            "packageId"=>50,
            "prices"=>[
              {
                "hourlyRecurringFee"=>".24",
                "id"=>1921,
                "recurringFee"=>"159",
                "item"=>{
                  "description"=>"2 x 2.0 GHz Core Bare Metal Instance - 2 GB Ram"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>37620,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"Ubuntu Linux 14.04 LTS Trusty Tahr - Minimal Install (64 bit)"
                }
              },
              {
                "hourlyRecurringFee"=>"0",
                "id"=>1267,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"500 GB SATA II"
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
                "id"=>40640,
                "recurringFee"=>"0",
                "item"=>{
                  "description"=>"100 Mbps Dual Public & Private Network Uplinks (Unbonded)"
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
            "sshKeys"=>[],
            "useHourlyPricing"=>true
          }
        end
      end
    end
  end
end