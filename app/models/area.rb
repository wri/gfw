class Area < CartoDB::Model::Base
  set_geometry_type :polygon
  field :email

end
