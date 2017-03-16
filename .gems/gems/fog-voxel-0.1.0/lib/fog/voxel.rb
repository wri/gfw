require "fog/core"
require "fog/xml"
require "digest/md5"
require File.expand_path("../voxel/version", __FILE__)

module Fog
  module Voxel
    extend Fog::Provider

    service(:compute, "Compute")

    def self.create_signature(secret, options)
      to_sign = options.keys.map { |k| k.to_s }.sort.map { |k| "#{k}#{options[k.to_sym]}" }.join("")
      Digest::MD5.hexdigest( secret + to_sign )
    end
  end

  module Compute
    autoload :Voxel, File.expand_path("../compute/voxel", __FILE__)
  end

  module Parsers
    autoload :Compute, File.expand_path("../parsers/compute", __FILE__)
  end
end
