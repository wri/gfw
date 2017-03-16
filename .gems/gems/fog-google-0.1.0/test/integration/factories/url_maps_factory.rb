require "integration/factories/collection_factory"
require "integration/factories/backend_services_factory"

class UrlMapsFactory < CollectionFactory
  def initialize(example)
    @backend_services = BackendServicesFactory.new(example)
    super(Fog::Compute[:google].url_maps, example)
  end

  def cleanup
    super
    @backend_services.cleanup
  end

  def params
    params = {:name => resource_name,
              :default_service => @backend_services.create.self_link}
  end
end
