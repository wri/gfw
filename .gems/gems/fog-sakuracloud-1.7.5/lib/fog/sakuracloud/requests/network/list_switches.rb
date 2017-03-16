# coding: utf-8

module Fog
  module Network
    class SakuraCloud
      class Real
        def list_switches(options = {})
          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :method => 'GET',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/switch"
          )
        end
      end

      class Mock
        def list_switches(options = {})
          response = Excon::Response.new
          response.status = 200
          response.body = {
            "Switches"=>
            [{"Index"=>0,
              "ID"=>"112600703732",
              "Name"=>"foobar1",
              "Description"=>"",
              "ServerCount"=>0,
              "ApplianceCount"=>0,
              "HybridConnection"=>nil,
              "ServiceClass"=>"cloud/switch/default",
              "CreatedAt"=>"2014-09-05T16:35:41+09:00",
              "Subnets"=>
            [{"ID"=>nil,
              "NetworkAddress"=>nil,
              "NetworkMaskLen"=>nil,
              "DefaultRoute"=>nil,
              "NextHop"=>nil,
              "StaticRoute"=>nil,
              "ServiceClass"=>nil,
              "IPAddresses"=>{"Min"=>nil, "Max"=>nil},
              "Internet"=>{"ID"=>nil, "Name"=>nil, "BandWidthMbps"=>nil, "ServiceClass"=>nil}}],
            "IPv6Nets"=>[],
            "Internet"=>nil,
            "Bridge"=>nil},
            {"Index"=>1,
             "ID"=>"112600703734",
             "Name"=>"foobar2",
             "Description"=>"",
             "ServerCount"=>1,
             "ApplianceCount"=>0,
             "HybridConnection"=>nil,
             "ServiceClass"=>"cloud/switch/default",
             "CreatedAt"=>"2014-09-05T16:36:13+09:00",
             "Subnets"=>
            [{"ID"=>1036,
              "NetworkAddress"=>"133.242.241.240",
              "NetworkMaskLen"=>28,
              "DefaultRoute"=>"133.242.241.241",
              "NextHop"=>nil,
              "StaticRoute"=>nil,
              "ServiceClass"=>"cloud/global-ipaddress-v4/28",
              "IPAddresses"=>{"Min"=>"133.242.241.244", "Max"=>"133.242.241.254"},
              "Internet"=>{"ID"=>"112600703733", "Name"=>"hogehoge2", "BandWidthMbps"=>100, "ServiceClass"=>"cloud/internet/router/100m"}}],
            "IPv6Nets"=>[],
            "Internet"=>{"ID"=>"112600703733", "Name"=>"hogehoge2", "BandWidthMbps"=>100, "Scope"=>"user", "ServiceClass"=>"cloud/internet/router/100m"},
            "Bridge"=>nil}]
          }
          response
        end
      end
    end
  end
end
