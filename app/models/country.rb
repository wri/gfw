class Country

  def self.countries_info
    CartoDB::Connection.query("SELECT name, iso, enabled FROM gfw2_countries ORDER BY name;")[:rows]
  end

  def self.countries_info_with_alerts
    CartoDB::Connection.query("SELECT sum(alerts) AS count, (SELECT name FROM gfw2_countries WHERE iso = gfg.iso LIMIT 1) AS name, (SELECT enabled FROM gfw2_countries WHERE iso = gfg.iso LIMIT 1) AS enabled, iso FROM gfw2_forma_graphs gfg WHERE date >= (SELECT MAX(n) FROM gfw2_forma_datecode WHERE date < now() - INTERVAL '12 MONTHS') GROUP BY name, iso ORDER BY name;")[:rows]
  end

  def self.country_info(name = '')
    CartoDB::Connection.query("
      SELECT name,
             iso,
             forest_extent,
             gross_value,
             gdp_percent,
             employment,
             national_policy_link,
             national_policy_title,
             carbon_stocks,
             emissions_land,
             emissions_noland,
             conventions,
             ministry_link,
             dataset_link,
             lat,
             lon,
             map_coord
      FROM gfw2_countries
      WHERE name = '"+name.humanize.titleize+"';")[:rows]
  end

end
