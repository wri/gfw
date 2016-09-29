# encoding: utf-8

class DataUploader < CarrierWave::Uploader::Base
  # Choose what kind of storage to use for this uploader:
  storage (Rails.env.production? ? :fog : :file)

  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  def initialize(*)
    super

    self.fog_credentials = {
      :provider               => 'AWS',
      :aws_access_key_id      => ENV['AWS_ACCESS_KEY_ID'],
      :aws_secret_access_key  => ENV['AWS_SECRET_ACCESS_KEY'],
    }
    self.fog_directory = ENV['S3_DATA_BUCKET_NAME']
  end


  # Choose what kind of storage to use for this uploader:
  # storage :file

  def cache_dir
    "#{Rails.root}/tmp/uploads"
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  def filename
    DateTime.now.strftime('%Q') + Digest::MD5.hexdigest(original_filename) + original_filename if original_filename
  end

end
