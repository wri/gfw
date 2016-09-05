# encoding: utf-8

class DataUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

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
