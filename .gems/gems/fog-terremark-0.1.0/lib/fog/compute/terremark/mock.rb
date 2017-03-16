module Fog
  module Compute
    class Terremark
      class Mock
        include Common

        def self.mock_data
          {
              :organizations =>
                  [
                      {
                          :info => {
                              :name => "Boom Inc.",
                              :id => 1
                          },
                          :vdcs => [
                              { :id => 21,
                                :name => "Boomstick",
                                :storage => { :used => 105, :allocated => 200 },
                                :cpu => { :allocated => 10000 },
                                :memory => { :allocated => 20480 },
                                :networks => [
                                    { :id => 31,
                                      :name => "1.2.3.0/24",
                                      :subnet => "1.2.3.0/24",
                                      :gateway => "1.2.3.1",
                                      :netmask => "255.255.255.0",
                                      :fencemode => "isolated"
                                    },
                                    { :id => 32,
                                      :name => "4.5.6.0/24",
                                      :subnet => "4.5.6.0/24",
                                      :gateway => "4.5.6.1",
                                      :netmask => "255.255.255.0",
                                      :fencemode => "isolated"
                                    },
                                ],
                                :vms => [
                                    { :id => 41,
                                      :name => "Broom 1"
                                    },
                                    { :id => 42,
                                      :name => "Broom 2"
                                    },
                                    { :id => 43,
                                      :name => "Email!"
                                    }
                                ],
                                :public_ips => [
                                    { :id => 51,
                                      :name => "99.1.2.3"
                                    },
                                    { :id => 52,
                                      :name => "99.1.2.4"
                                    },
                                    { :id => 53,
                                      :name => "99.1.9.7"
                                    }
                                ]
                              },
                              { :id => 22,
                                :storage => { :used => 40, :allocated => 150 },
                                :cpu => { :allocated => 1000 },
                                :memory => { :allocated => 2048 },
                                :name => "Rock-n-Roll",
                                :networks => [
                                    { :id => 33,
                                      :name => "7.8.9.0/24",
                                      :subnet => "7.8.9.0/24",
                                      :gateway => "7.8.9.1",
                                      :netmask => "255.255.255.0",
                                      :fencemode => "isolated"
                                    }
                                ],
                                :vms => [
                                    { :id => 44,
                                      :name => "Master Blaster"
                                    }
                                ],
                                :public_ips => [
                                    { :id => 54,
                                      :name => "99.99.99.99"
                                    }
                                ]
                              }
                          ]
                      }
                  ]
          }
        end

        def self.error_headers
          {
              "X-Powered-By" => "ASP.NET",
              "Date" =>  Time.now.to_s,
              "Content-Type" => "text/html",
              "Content-Length" => "0",
              "Server" => "Microsoft-IIS/7.0",
              "Cache-Control" => "private"
          }
        end

        def self.unathorized_status
          401
        end

        def self.headers(body, content_type)
          {
              "X-Powered-By" => "ASP.NET",
              "Date" =>  Time.now.to_s,
              "Content-Type" =>  content_type,
              "Content-Length" =>  body.to_s.length,
              "Server" => "Microsoft-IIS/7.0",
              "Set-Cookie" => "vcloud-token=ecb37bfc-56f0-421d-97e5-bf2gdf789457; path=/",
              "Cache-Control" => "private"
          }
        end

        def self.status
          200
        end

        def initialize(_options={})
          self.class.instance_eval "
            def self.data
              @data ||= Hash.new do |hash, key|
                hash[key] = Fog::Compute::Terremark::Mock.mock_data
              end
            end"
          self.class.instance_eval "
            def self.reset
              @data = nil
            end

            def self.reset_data(keys=data.keys)
              for key in [*keys]
                data.delete(key)
              end
            end"
        end
      end
    end
  end
end