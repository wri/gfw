# encoding: utf-8

class MediaUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  # storage :file

  def cache_dir
    "#{Rails.root}/tmp/uploads"
  end

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Rotates the image based on the EXIF Orientation
  def fix_exif_rotation
    manipulate! do |img|
      img.auto_orient
      img = yield(img) if block_given?
      img
    end
  end

  # Strips out all embedded information from the image
  def strip
    manipulate! do |img|
      img.strip
      img = yield(img) if block_given?
      img
    end
  end

  # Reduces the quality of the image to the percentage given
  def quality(percentage)
    manipulate! do |img|
      img.write(current_path){ self.quality = percentage }
      img = yield(img) if block_given?
      img
    end
  end

  # Create different versions of your uploaded files:
  version :thumb do
    process :fix_exif_rotation
    process :strip
    process :resize_to_fill => [256, 256]
    process :quality => 90
  end

  version :big do
    process :fix_exif_rotation
    process :strip
    process :resize_to_fill => [960, 364]
    process :quality => 90
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  # def extension_white_list
  #   %w(jpg jpeg gif png)
  # end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  def filename
    DateTime.now.strftime('%Q') + Digest::MD5.hexdigest(original_filename) + original_filename if original_filename
  end

end
