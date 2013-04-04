class Country

  def self.countries_info
    CartoDB::Connection.query("SELECT name, iso, enabled FROM gfw2_countries ORDER BY name;")[:rows]
  end

  def self.country_info(name = '')
    CartoDB::Connection.query("SELECT name, iso, about, wikipedia_link, lat, lon, map_coord FROM gfw2_countries where name = '"+name.humanize.titleize+"';")[:rows]
  end

end
