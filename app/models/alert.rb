class Alert

  def self.ammount_in_the_last_year
     result = CartoDB::Connection.query("SELECT sum(alerts) as alerts FROM gfw2_forma_graphs WHERE date > (SELECT n FROM gfw2_forma_datecode WHERE now() -INTERVAL '6 months' < date ORDER BY date ASC LIMIT 1);")
     result[:rows].first[:alerts] rescue 0
  end

  def self.alerts_per_country
    results = CartoDB::Connection.query("SELECT count(*) as alerts_count, iso FROM gfw2_forma WHERE z=17 GROUP BY iso;")

    Hash[results[:rows].map{|r| [r[:iso].delete('{}'), r[:alerts_count]]}] rescue []
  end

  def self.last_alerts_per_country(country_iso_code)

    results = CartoDB::Connection.query(<<-SQL)
      SELECT sum(alerts) as count,
        iso
      FROM gfw2_forma_graphs gfg
      WHERE iso = '#{country_iso_code}'
      AND date > (SELECT n
                  FROM gfw2_forma_datecode
                  WHERE now() -INTERVAL '6 months' < date
                  ORDER BY date ASC LIMIT 1)
                  GROUP BY iso
    SQL
    results[:rows]
  end

  def self.alerts_per_month_per_country(country_iso_code)

    results = CartoDB::Connection.query(<<-SQL)
      SELECT sum(alerts) as count, iso,
      (SELECT date::date
          FROM gfw2_forma_datecode
          WHERE n = gfg.date) as date
          FROM gfw2_forma_graphs gfg
          WHERE iso = '#{country_iso_code}'
          AND date > (
        SELECT n
        FROM gfw2_forma_datecode
      WHERE now() -INTERVAL '6 months' < date
      ORDER BY date ASC LIMIT 1)
      GROUP BY iso, date
      ORDER BY date DESC;
    SQL

    results[:rows]

  end

end
