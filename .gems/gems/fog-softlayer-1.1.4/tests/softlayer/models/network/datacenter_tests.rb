#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Network[:softlayer] | Datacenter model", ["softlayer"]) do
  pending unless Fog.mocking?

  tests("success") do
    @dc = Fog::Network[:softlayer].datacenters.first

    tests("#get_avaliable_maintenance_windows(begin_date, end_date, slots_number)") do
      data_matches_schema(Array) { @dc.get_avaliable_maintenance_windows("2015-06-01", "2015-06-02", 1) }
    end
  end

  tests ("failure") do
    tests("#get_avaliable_maintenance_windows(nil, end_date, slots_number)") do
      raises(ArgumentError) { @dc.get_avaliable_maintenance_windows(nil, "2015-06-02", 1) }
    end

    tests("#get_maintenance_windows(location_id, begin_date, nil, slots_number)") do
      raises(ArgumentError) { @dc.get_avaliable_maintenance_windows("2015-06-01", nil, 1) }
    end

    tests("#get_maintenance_windows(location_id, begin_date, end_date)") do
      raises(ArgumentError) { @dc.get_avaliable_maintenance_windows("2015-06-01", "2015-06-02") }
    end
  end
end
