class User < CartoDB::Model::Base
  include ActiveModel::Validations

  cartodb_table_name "users#{CartoDB::TABLES_SUFFIX}"

  SELECT_FIELDS = <<-SQL
     cartodb_id,
     email
  SQL

  set_geometry_type nil

  field :email
end
