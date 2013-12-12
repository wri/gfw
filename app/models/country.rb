class Country

  def self.api_attributes
    [
      'name',
      'iso',
      'forest_extent',
      'gross_value',
      'gdp_percent_fixed',
      'employment',
      'national_policy_link',
      'national_policy_title',
      'carbon_stocks',
      'emissions_land',
      'emissions_noland',
      'ministry_link',
      'dataset_link',
      'lat',
      'lon',
      'map_coord',
      'convention_cbd',
      'convention_unfccc',
      'convention_kyoto',
      'convention_unccd',
      'convention_itta',
      'convention_cites',
      'convention_ramsar',
      'convention_world_heritage',
      'convention_nlbi',
      'convention_ilo',
      'indepth'
     ]
  end

  def self.countries_info
    CartoDB::Connection.query("SELECT name, iso, enabled FROM gfw_country_page_data ORDER BY name;")[:rows]
  end

  def self.countries_info_with_alerts
    CartoDB::Connection.query("
      SELECT c.iso as iso,
             c.name as name,
             c.enabled as enabled,
             (SELECT COALESCE(sum(alerts), 0) as sum
                FROM gfw2_forma_graphs as d
                WHERE d.iso = c.iso AND date >= (SELECT MAX(n) FROM gfw2_forma_datecode WHERE date < now() - INTERVAL '12 MONTHS')
             ) as sum_alerts
      FROM gfw_country_page_data as c
      ORDER BY name ASC;")[:rows]
  end

  def self.country_info(name = '')
    query = "SELECT "

    self.api_attributes.each do |attr|
      query << "#{attr}, "
    end

    CartoDB::Connection.query(
      query.gsub(/\, $/, '') << " FROM gfw_country_page_data WHERE name = '"+name.humanize.titleize+"'"
    )[:rows]
  end

end
