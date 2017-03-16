require "fog/core"
require "fog/json"
require "fog/aliyun/version"

module Fog
  module Compute
    ret = autoload :Aliyun, "fog/aliyun/compute"
  end

  module Storage
    ret = autoload :Aliyun, "fog/aliyun/storage"
  end
  
  module Aliyun
    extend Fog::Provider
    service(:compute, "Compute")
    service(:storage, "Storage")
  end
end
