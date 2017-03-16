#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Network
    class Softlayer
      class Mock
        def get_maintenance_windows(location_id, begin_date, end_date, slots_number)
          raise ArgumentError, "Arguments for #{self.class.name}##{__method__} must be present." if begin_date.nil? || end_date.nil? || location_id.nil? || slots_number.nil?
          response = Excon::Response.new
          response.status = 200
          response.body = get_windows
          response
        end

      end

      class Real
        def get_maintenance_windows(location_id, begin_date, end_date, slots_number)
          request(:provisioning_maintenance_window, :get_maintenance_windows, :body => [begin_date, end_date, location_id, slots_number], :http_method => :POST)
        end
      end
    end
  end
end

module Fog
  module Network
    class Softlayer
      class Mock
        def get_windows
          [
            {
              "beginDate"=>"2015-06-01T09:00:00-06:00",
              "dayOfWeek"=>1,
              "endDate"=>"2015-06-01T12:00:00-06:00",
              "id"=>12570,
              "locationId"=>265592,
              "portalTzId"=>201
            },
            {
              "beginDate"=>"2015-06-01T17:00:00-06:00",
              "dayOfWeek"=>2,
              "endDate"=>"2015-06-01T20:00:00-06:00",
              "id"=>12584,
              "locationId"=>265592,
              "portalTzId"=>201
            },
            {
              "beginDate"=>"2015-06-01T17:00:00-06:00",
              "dayOfWeek"=>2,
              "endDate"=>"2015-06-01T20:00:00-06:00",
              "id"=>117748,
              "locationId"=>265592,
              "portalTzId"=>201
            },
            {
              "beginDate"=>"2015-06-02T01:00:00-06:00",
              "dayOfWeek"=>2,
              "endDate"=>"2015-06-02T04:00:00-06:00",
              "id"=>12568,
              "locationId"=>265592,
              "portalTzId"=>201
            },
            {
              "beginDate"=>"2015-06-02T09:00:00-06:00",
              "dayOfWeek"=>2,
              "endDate"=>"2015-06-02T12:00:00-06:00",
              "id"=>12591,
              "locationId"=>265592,
              "portalTzId"=>201
            }
          ]
        end
      end
    end
  end
end
