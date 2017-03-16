require "integration/factories/collection_factory"
require "integration/factories/url_maps_factory"

class TargetHttpProxiesFactory < CollectionFactory
  def initialize(example)
    @url_maps = UrlMapsFactory.new(example)
    super(Fog::Compute[:google].target_http_proxies, example)
  end

  def cleanup
    super
    @url_maps.cleanup
  end

  def params
    params = {:name => resource_name,
              :url_map => @url_maps.create.self_link}
  end
end
