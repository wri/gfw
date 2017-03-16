#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Network[:softlayer] | datacenter requests", ["softlayer"]) do

  @sl = Fog::Network[:softlayer]

  tests('success') do
    tests("#get_datacenters") do
      response = @sl.get_datacenters
      data_matches_schema(Array) { response.body }
      data_matches_schema(Hash) { response.body.first }
      data_matches_schema(200) {response.status}
    end

    tests("#get_maintenance_windows(location_id, begin_date, end_date, slots_number)") do
      response = @sl.get_maintenance_windows(1, "2015-06-01", "2015-06-02", 1)
      data_matches_schema(Array) { response.body }
      data_matches_schema(200) {response.status}
    end
  end

  tests('failure') do
    tests("#get_maintenance_windows(nil, begin_date, end_date, slots_number)") do
      raises(ArgumentError) { @sl.get_maintenance_windows(nil, "2015-06-01", "2015-06-02", 1) }
    end

    tests("#get_maintenance_windows(location_id, nil, end_date, slots_number)") do
      raises(ArgumentError) { @sl.get_maintenance_windows(1, nil, "2015-06-02", 1) }
    end

    tests("#get_maintenance_windows(location_id, begin_date, nil, slots_number)") do
      raises(ArgumentError) { @sl.get_maintenance_windows(1, "2015-06-01", nil, 1) }
    end

    tests("#get_maintenance_windows(location_id, begin_date, end_date)") do
      raises(ArgumentError) { @sl.get_maintenance_windows(1, "2015-06-01", "2015-06-02") }
    end
  end
end
