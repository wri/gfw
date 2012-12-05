class Story < CartoDB::Model::Base
  include ActiveModel::Validations

  field :title
  field :when_did_it_happen
  field :details
  field :your_name
  field :your_email
  field :featured, :type => 'boolean'
  field :visible,  :type => 'boolean'
  field :token

  set_geometry_type :geometry

  #validates_each :title, :the_geom, :your_name do |record, attr, value|
  validates_each :title do |record, attr, value|
    record.errors.add attr, 'cannot be empty' if value.blank?
  end

  def save
    generate_token
    super
  end

  def generate_token
    self.token = SecureRandom.urlsafe_base64
  end

  def media
    Media.where(:story_id => self.cartodb_id)
  end

  def main_thumbnail
    media.first rescue nil
  end

  def to_param
    cartodb_id.to_s
  end
end
