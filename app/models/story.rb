class Story < CartoDB::Model::Base
  include ActiveModel::Validations

  attr_accessor :uploads_ids

  SELECT_FIELDS = <<-SQL
             cartodb_id,
             title,
             description,
             when_did_it_happen,
             details,
             your_name,
             your_email,
             featured,
             visible,
             token,
             ST_ASGEOJSON(stories.the_geom) AS geometry,
             ST_X(ST_Centroid(stories.the_geom)) AS lng,
             ST_Y(ST_Centroid(stories.the_geom)) AS lat
  SQL

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
    @uploads_ids = params.delete(:uploads_ids)
    super
  end

  def update_attributes(attributes)
    (attributes.presence || {}).each do |k, v|
      self.send("#{k}=", v)
    end
    self
  end

  def self.first_three_featured
    sql = <<-SQL
      SELECT stories.cartodb_id AS id,
             title,
             media.thumbnail_url,
             ST_Y(ST_Centroid(stories.the_geom)) || ', ' || ST_X(ST_Centroid(stories.the_geom)) AS coords
      FROM stories
      LEFT OUTER JOIN media ON media.story_id = stories.cartodb_id
      ORDER BY stories.cartodb_id DESC
      LIMIT 3
    SQL

    result = CartoDB::Connection.query(sql)

    result[:rows] rescue []
  end

  def self.all_for_map
    sql = <<-SQL
      SELECT stories.cartodb_id AS id,
             title,
             your_name AS name,
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
    (media.map{|m| m.cartodb_id}.presence || (@uploads_ids.presence || '').split(',')).join(',')
  end

  def the_geom
    the_geom = attributes[:the_geom]
    RGeo::GeoJSON.encode(the_geom).to_json if the_geom.present?
  end

  def coords
    "#{attributes[:lat]}, #{attributes[:lng]}" if attributes.slice(:lat, :lng).present?
  end

  def featured=(value)
    @featured = value == '1'
    attributes[:featured] = @featured
  end

  def save
    generate_token if new_record?
    super
    save_thumbnails
  end

  def generate_token
    self.token = SecureRandom.urlsafe_base64
  end

  def media
    @media ||= Media.where(:story_id => self.cartodb_id).order('media_order ASC').all
  end

  def unlinked_media
    (@uploads_ids || '').split(',').map{|id| Media.where(:cartodb_id => id)}
  end

  def main_thumbnail
    @main_thumbnail ||= media.first rescue nil
  end

  def thumbnail_url
    @thumbnail_url ||= main_thumbnail.try(:thumbnail_url)
  end

  def to_param
    cartodb_id.to_s
  end

  def save_thumbnails
    (@uploads_ids || '').split(',').each_with_index do |media_id, index|
      media = Media.where(:cartodb_id => media_id)
      media.update_story_id(cartodb_id, index)
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
    {
      title: title,
      name: your_name,
      lat: lat,
      lng: lon
    }
  end

  def self.featured(page, stories_per_page)
    results = CartoDB::Connection.query(<<-SQL)
      SELECT stories.cartodb_id AS id,
             title,
             details,
             your_name AS name,
             media.thumbnail_url,
             ST_Y(ST_Centroid(ST_Envelope(stories.the_geom))) || ',' || ST_X(ST_Centroid(ST_Envelope(stories.the_geom))) AS coords
      FROM stories
      LEFT OUTER JOIN media ON media.story_id = stories.cartodb_id
      WHERE stories.featured = true
      ORDER BY stories.cartodb_id ASC
      LIMIT #{stories_per_page}
      OFFSET #{(page - 1) * stories_per_page}
    SQL
    return results.rows.try(:sample, 5) || [] if results
    []
  end

  def self.random(limit)
    results = CartoDB::Connection.query(<<-SQL)
      SELECT DISTINCT ON (stories.cartodb_id)
             stories.cartodb_id,
             stories.title,
             stories.your_name,
             stories.featured,
             ST_Y(ST_Centroid(ST_Envelope(stories.the_geom))) || ',' || ST_X(ST_Centroid(ST_Envelope(stories.the_geom))) AS coords,
             media.thumbnail_url
      FROM stories
      LEFT OUTER JOIN media ON media.story_id = stories.cartodb_id
    SQL
    return results.rows.try(:sample, 5) || [] if results
    []
  end

  def self.by_id_or_token(id)
    results = CartoDB::Connection.query(<<-SQL)
      SELECT stories.cartodb_id,
             stories.token,
             stories.title,
             stories.details,
             stories.when_did_it_happen,
             stories.your_name,
             stories.featured,
             stories.visible,
             ST_Y(ST_Centroid(ST_Envelope(stories.the_geom))) || ',' || ST_X(ST_Centroid(ST_Envelope(stories.the_geom))) AS coords,
             media.big_url
      FROM stories
      LEFT OUTER JOIN media ON media.story_id = stories.cartodb_id
      WHERE stories.cartodb_id = #{id} OR stories.token = '#{id}'
    SQL
    return results.rows || [] if results
    []
  end

end
