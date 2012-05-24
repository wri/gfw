module CartodbHelpers

  def drop_all_cartodb_tables
    return unless CartoDB::Connection

    tables_list = CartoDB::Connection.tables || []

    tables_list.tables.each do |table|
      CartoDB::Connection.drop_table(table.name) if table && table.name
    end
  end

end
RSpec.configuration.include CartodbHelpers
