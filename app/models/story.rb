class Story < CartoDB::Model::Base
  include ActiveModel::Validations

  attr_accessor :uploads_ids

  set_geometry_type :geometry

  field :title
  field :when_did_it_happen
  field :details
  field :your_name
  field :your_email
  field :featured, :type => 'boolean'
  field :visible,  :type => 'boolean'
  field :token

  validates_each :title, :the_geom, :your_name do |record, attr, value|
    record.errors.add attr, 'cannot be empty' if value.blank?
  end

  def initialize(params)
    self.uploads_ids = params.delete(:uploads_ids)
    super
  end

  def uploads_ids
    (media || []).map{|m| m.cartodb_id}.join(',')
  end

  def save
    generate_token
    super
    save_thumbnails
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

  def save_thumbnails
    (@uploads_ids || '').split(',').each do |media_id|
      media = Media.where(:cartodb_id => media_id)
      media.update_story_id(cartodb_id)
    end
  end
end
