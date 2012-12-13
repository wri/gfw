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

  validates_each :title, :the_geom, :your_name, :your_email do |record, attr, value|
    record.errors.add attr, I18n.t(attr, :scope => 'errors.story.blank') if value.blank?
  end

  def initialize(params)
    self.uploads_ids = params.delete(:uploads_ids)
    super
  end

  def self.all_for_map
    sql = <<-SQL
      SELECT title,
             your_name as name,
             media.thumbnail_url,
             ST_ASGEOJSON(stories.the_geom) AS geometry,
             ST_X(ST_Centroid(stories.the_geom)) AS lng,
             ST_Y(ST_Centroid(stories.the_geom)) AS lat
      FROM stories
      LEFT OUTER JOIN media ON media.story_id = stories.cartodb_id
    SQL

    result = CartoDB::Connection.query(sql)

    result[:rows] rescue []
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

  def lat
    return the_geom.centroid.y if respond_to?(:centroid)
    the_geom.y
  end

  def lon
    return the_geom.centroid.x if respond_to?(:centroid)
    the_geom.x
  end

  def to_json
    require 'debugger'; debugger
    {
      title: title,
      name: your_name,
      lat: lat,
      lng: lon
    }
  end
end
